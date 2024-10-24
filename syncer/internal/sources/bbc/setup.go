package bbc

import "ncrawler/internal/definition"

const (
	baseCollectionApiURL = `https://web-cdn.api.bbci.co.uk/xd/content-collection/07cedf01-f642-4b92-821f-d7b324b8ba73?page=0&size=20`
	baseURLFmt           = `https://www.bbc.com%s`
	baseImageURLFmt      = ``
)

func GetScraper() definition.Source {
	return &scraper{}
}
