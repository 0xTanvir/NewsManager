package aljazeera

import "ncrawler/internal/definition"

const (
	baseCollectionApiURL = `https://www.aljazeera.com/graphql?wp-site=aje&operationName=ArchipelagoAjeSectionPostsQuery&variables=%7B%22category%22%3A%22news%22%2C%22categoryType%22%3A%22categories%22%2C%22postTypes%22%3A%5B%22blog%22%2C%22episode%22%2C%22opinion%22%2C%22post%22%2C%22video%22%2C%22external-article%22%2C%22gallery%22%2C%22podcast%22%2C%22longform%22%2C%22liveblog%22%5D%2C%22quantity%22%3A20%2C%22offset%22%3A0%7D&extensions=%7B%7D`
	baseURLFmt           = `https://www.aljazeera.com%s`
	baseImageURLFmt      = ``
)

func GetScraper() definition.Source {
	return &scraper{}
}
