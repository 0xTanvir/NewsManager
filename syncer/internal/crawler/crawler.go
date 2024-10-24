package crawler

import (
	"log/slog"

	"ncrawler/internal/definition"
	"ncrawler/pkg/helpers"
)

type crawler struct {
}

func GetCrawler() definition.Crawler {
	return &crawler{}
}

func (c *crawler) Sync(source definition.Source) error {
	latestNews, err := source.GetLatest()
	if err != nil {
		return err
	}

	// Save it to db
	// Get a connection pool to the database
	dbPool := helpers.GetDbPool()
	numberOfStory, err := dbPool.News.AddNewsStories(latestNews)
	if err != nil {
		return err
	}

	slog.Info("news data synced to database", "count", numberOfStory)

	return nil
}
