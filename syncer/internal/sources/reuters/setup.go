package reuters

import "ncrawler/internal/definition"

const (
	baseCollectionApiURL = `https://www.reuters.com/pf/api/v3/content/fetch/articles-by-section-alias-or-id-v1?query={"arc-site":"reuters","fetch_type":"collection","offset":0,"section_id":"/world/","size":20,"uri":"/world/","website":"reuters"}&_website=reuters`
	baseURLFmt           = `https://www.reuters.com%s`
	baseImageURLFmt      = ``
)

func GetScraper() definition.Source {
	return &scraper{}
}
