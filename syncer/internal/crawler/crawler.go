package crawler

import (
	"log/slog"

	"ncrawler/internal/definition"
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
		latestNews, err := source.GetLatest()
		if err != nil {
			return err
		}
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
