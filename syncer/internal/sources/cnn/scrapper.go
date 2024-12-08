package cnn

import (
	"fmt"
	"log/slog"
	"strings"

	"ncrawler/internal/dto"
	"ncrawler/internal/sources"
	"ncrawler/pkg/helpers"

	"github.com/gocolly/colly/v2"
	"github.com/gocolly/colly/v2/queue"
)

type scraper struct {
}

func (s *scraper) GetLatest() (dto.NewsList, error) {
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

	c.OnHTML("div.zone__items.layout--wide-left-balanced-2", func(e *colly.HTMLElement) {
		e.ForEach("a", func(_ int, el *colly.HTMLElement) {
			newsLinks = append(newsLinks, fmt.Sprintf(baseURLFmt, el.Attr("href")))
		})
	})

	// Handle request errors
	c.OnError(func(r *colly.Response, err error) {
		slog.Error("error at fetching:", "url", r.Request.URL.String(), "error", err)
	})

	err := c.Visit(baseWorldURL)
	if err != nil {
		return nil, err
	}

	c.Wait()

	return helpers.GetUniqueStrings(newsLinks), nil
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
		1,
		&queue.InMemoryQueueStorage{MaxSize: 10000},
	)

	for _, nl := range nLinks {
		if strings.Contains(nl, "cnn.com/interactive") {
			continue
		}
		q.AddURL(nl)
	}

	c.OnRequest(func(r *colly.Request) {
		r.Headers.Set("User-Agent", helpers.GetRandomUserAgent())
		slog.Info("visiting", "url", r.URL.String())
	})

	c.OnHTML("html", func(e *colly.HTMLElement) {
		newsStory := dto.News{
			Id:              e.Request.URL.String(),
			SourceName:      sources.SOURCE_CNN,
			Category:        sources.CATEGORY_WORLD,
			SourceLink:      e.Request.URL.String(),
			Headline:        strings.TrimSpace(e.ChildText("h1#maincontent")),
			MetaDescription: e.ChildAttr("meta[name='description']", "content"),
			ImageLink:       e.ChildAttr("meta[property='og:image']", "content"),
			Date:            helpers.GetCurrentTimestamp(),
			Story:           e.ChildText("div.article__content"),
		}

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
