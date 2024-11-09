package cnn

import "ncrawler/internal/definition"

const (
	baseWorldURL    = `https://edition.cnn.com/world`
	baseURLFmt      = `https://edition.cnn.com%s`
	baseImageURLFmt = ``
)

func GetScraper() definition.Source {
	return &scraper{}
}
