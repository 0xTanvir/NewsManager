package prothomalo

import (
	"encoding/json"
	"log/slog"
	"ncrawler/internal/dto"
	"ncrawler/pkg/helpers"

	"github.com/gocolly/colly/v2"
)

type scraper struct {
}

func (s *scraper) GetLatest() ([]dto.News, error) {
	var (
		c           *colly.Collector
		newsStories []dto.News
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

		newsStories = nr.ToStories()
	})

	// Handle request errors
	c.OnError(func(r *colly.Response, err error) {
		slog.Error("error at fetching:", "url", r.Request.URL.String(), "error", err)
	})

	c.Visit(baseApiURL)

	c.Wait()

	return newsStories, nil
}
