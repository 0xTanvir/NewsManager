package theguardian

import "ncrawler/internal/definition"

const (
	baseCollectionApiURL = `https://api.nextgen.guardianapps.co.uk/most-read/world.json?_edition=INT&dcr=true`
	baseURLFmt           = `https://www.theguardian.com/%s`
	baseImageURLFmt      = ``
)

func GetScraper() definition.Source {
	return &scraper{}
}
