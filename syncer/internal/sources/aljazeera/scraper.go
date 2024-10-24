package aljazeera

import (
	"encoding/json"
	"log/slog"

	"ncrawler/internal/dto"
	"ncrawler/internal/sources"
	"ncrawler/pkg/helpers"

	"github.com/gocolly/colly/v2"
	"github.com/gocolly/colly/v2/queue"
)

type scraper struct {
}

func (s *scraper) GetLatest() ([]dto.News, error) {
	nLinks, err := s.getLatestNewsLink()
	if err != nil {
		return nil, err
	}

	// Save it to db
	// Get a connection pool to the database
	dbPool := helpers.GetDbPool()
	newNewsLink, err := dbPool.News.DetectNewLinks(nLinks)
	if err != nil {
		return nil, err
	}

	return s.getNewsDetails(newNewsLink)
}

func (s *scraper) getLatestNewsLink() ([]string, error) {
	var (
		c         *colly.Collector
		newsLinks []string
	)

	c = helpers.GetCollector()

	c.OnRequest(func(r *colly.Request) {
		r.Headers.Set("wp-site", "aje")
		r.Headers.Set("User-Agent", helpers.GetRandomUserAgent())
		slog.Info("visiting", "url", r.URL.String())
	})

	// Handle the JSON response
	c.OnResponse(func(r *colly.Response) {
		var nr NewsResponse
		// Unmarshal JSON into Go struct
		if err := json.Unmarshal(r.Body, &nr); err != nil {
			slog.Error("error at unmarshalling json", "error", err)
			return
		}

		newsLinks = nr.toLinks()
	})

	// Handle request errors
	c.OnError(func(r *colly.Response, err error) {
		slog.Error("error at fetching:", "url", r.Request.URL.String(), "error", err)
	})

	err := c.Visit(baseCollectionApiURL)
	if err != nil {
		return nil, err
	}

	c.Wait()

	return newsLinks, nil
}

func (s *scraper) getNewsDetails(nLinks []string) ([]dto.News, error) {
	if len(nLinks) == 0 {
		slog.Info("no new links found")
		return nil, nil
	}

	var (
		c           *colly.Collector
		newsStories []dto.News
	)

	c = helpers.GetCollector()

	q, _ := queue.New(
		2,
		&queue.InMemoryQueueStorage{MaxSize: 10000},
	)

	for _, nl := range nLinks {
		q.AddURL(nl)
	}

	c.OnRequest(func(r *colly.Request) {
		r.Headers.Set("wp-site", "aje")
		r.Headers.Set("User-Agent", helpers.GetRandomUserAgent())
		slog.Info("visiting", "url", r.URL.String())
	})

	c.OnHTML("html", func(e *colly.HTMLElement) {
		var newsStory dto.News
		e.ForEach("main", func(_ int, el *colly.HTMLElement) {
			newsStory = dto.News{
				Id:         el.Request.URL.String(),
				SourceName: sources.SOURCE_ALJAZEERA,
				Category:   sources.CATEGORY_WORLD,
				Headline:   el.ChildText("h1"),
				SourceLink: el.Request.URL.String(),
			}

			el.ForEach("div.wysiwyg--all-content", func(_ int, tb *colly.HTMLElement) {
				newsStory.Story += tb.ChildText("p")
			})
		})

		e.ForEach("script[type='application/ld+json']", func(_ int, el *colly.HTMLElement) {
			var jl JsonLD
			if err := json.Unmarshal([]byte(el.Text), &jl); err != nil {
				slog.Error("error at unmarshalling json-ld", "error", err)
				return
			}

			newsStory.MetaDescription = jl.Description
			newsStory.Date = helpers.TimeToStr(jl.DatePublished)
			if len(jl.Image) > 0 {
				newsStory.ImageLink = jl.Image[0].URL
			}
		})

		newsStories = append(newsStories, newsStory)
	})

	// Handle request errors
	c.OnError(func(r *colly.Response, err error) {
		slog.Error("error at fetching:", "url", r.Request.URL.String(), "error", err)
	})

	c.Wait()

	q.Run(c)

	return newsStories, nil
}
