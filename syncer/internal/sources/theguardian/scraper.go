package theguardian

import (
	"encoding/json"
	"log/slog"
	"strings"
	"time"

	"ncrawler/internal/dto"
	"ncrawler/internal/sources"
	"ncrawler/pkg/helpers"

	"github.com/PuerkitoBio/goquery"
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
		r.Headers.Set("User-Agent", helpers.GetRandomUserAgent())
		slog.Info("visiting", "url", r.URL.String())
	})

	// Handle the JSON response
	c.OnResponse(func(r *colly.Response) {
		var ar articleResponse
		// Unmarshal JSON into Go struct
		if err := json.Unmarshal(r.Body, &ar); err != nil {
			slog.Error("error at unmarshalling json", "error", err)
			return
		}

		if ar.Config.Page.IsLive {
			slog.Info("skipping live article", "url", r.Request.URL.String())
			return
		}

		newsStory := dto.News{
			Id:         r.Request.URL.String(),
			SourceName: sources.SOURCE_THE_GUARDIAN,
			Category:   sources.CATEGORY_WORLD,
			SourceLink: r.Request.URL.String(),
		}

		html := helpers.CleanHtml(ar.HTML)
		// Load the cleaned string into goquery for scraping
		doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))
		if err != nil {
			slog.Error("error at loading document", "error", err)
			return // Return to avoid further processing
		}

		// scrape H1 from doc
		// example: <h1 class="content__headline" itemprop="headline"> New Zealand </h1>
		newsStory.Headline = strings.TrimSpace(doc.Find("h1.content__headline").Text())
		// scrape Image from doc
		// <img class="maxed responsive-img" itemprop="contentUrl" alt="Dunedin Bono said." src="https://i.guim.co" />
		newsStory.ImageLink = doc.Find("img.maxed").AttrOr("src", "")
		// scrape meta description from doc
		// <meta itemprop="description" content="New Zealand" />
		newsStory.MetaDescription = doc.Find("meta[itemprop=description]").AttrOr("content", "")
		// scrape published date from doc and convert it to time.Time
		// <time itemprop="datePublished" datetime='2024-10-21T05:44:23+0100'
		// 	data-timestamp="1729485863000" class="content__dateline-wpd js-wpd"> Mon 21 Oct 2024
		// 	<span class="content__dateline-time">05.44 BST</span>
		// </time>
		publishedDateStr := doc.Find("time[itemprop=datePublished]").AttrOr("datetime", "")
		// Convert the string to time.Time
		// Define the layout that matches the input format
		layout := "2006-01-02T15:04:05-0700"
		// Parse the string into a time.Time object
		publishedDate, err := time.Parse(layout, publishedDateStr)
		if err != nil {
			slog.Info("Error parsing time:", "cause", err)
			return
		}
		newsStory.Date = helpers.TimeToStr(publishedDate)
		// Find the div with the class 'content__article-body' and extract text from all <p> tags
		story := doc.Find("div.content__article-body").Text()
		newsStory.Story = strings.TrimSpace(story)

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
