package prothomalo

import "ncrawler/internal/definition"

const (
	baseApiURL      = `https://www.prothomalo.com/route-data.json?path=%2Fcollection%2Flatest`
	baseImageURLFmt = `https://images.prothomalo.com/%s`
)

func GetScraper() definition.Source {
	return &scraper{}
}
