package crawler

import (
	"log/slog"
	"strings"

	"ncrawler/internal/ai"
	"ncrawler/internal/definition"
	"ncrawler/internal/dto"
	"ncrawler/internal/sources/cnn"
	"ncrawler/pkg/helpers"
)

type crawler struct {
}

func GetCrawler() definition.Crawler {
	return &crawler{}
}

func (c *crawler) Sync() error {
	sources := getSources()

	for _, source := range sources {
		slog.Info("syncing news data")
		latestNews, err := source.GetLatest()
		if err != nil {
			return err
		}
		slog.Info("news data fetched", "count", len(latestNews))

		// Sanitize the data
		latestNews.Sanitize()
		slog.Info("news data sanitized")

		slog.Info("generating summary for news data")
		// Generate Summary from the story with AI
		for i := range latestNews {
			slog.Info("generating summary", "headline", latestNews[i].Headline)
			summary, err := GenerateSummary(latestNews[i])
			if err != nil {
				slog.Error("failed to generate summary", "error", err)
				continue
			}

			latestNews[i].Summary = summary.Summary
			latestNews[i].BulletPoints = summary.KeyPoints
			latestNews[i].MetaKeywords = strings.Join(summary.Metadata.Categories, ", ")
		}
		slog.Info("summary generated")

		// Save it to db
		// Get a connection pool to the database
		dbPool := helpers.GetDbPool()
		err = dbPool.News.AddNewsStories(latestNews)
		if err != nil {
			return err
		}

		slog.Info("news data synced to database", "inserted", len(latestNews))
	}

	return nil
}

// getSources returns a list of sources to scrape
func getSources() []definition.Source {
	return []definition.Source{
		cnn.GetScraper(),
		// bbc.GetScraper(),
	}
}

func GenerateSummary(n dto.News) (ai.ArticleSummary, error) {
	as, err := ai.GetSummary(n)
	if err != nil {
		return ai.ArticleSummary{}, err
	}

	return *as, nil
}
