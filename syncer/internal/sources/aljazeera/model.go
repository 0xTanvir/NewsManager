package aljazeera

import (
	"fmt"
	"time"
)

type NewsResponse struct {
	Data struct {
		Articles []struct {
			ID      string `json:"id"`
			Title   string `json:"title"`
			Excerpt string `json:"excerpt"`
			Date    string `json:"date"`
			Link    string `json:"link"`
		} `json:"articles"`
	} `json:"data"`
}

func (nr NewsResponse) toLinks() []string {
	links := []string{}
	for _, nr := range nr.Data.Articles {
		links = append(links, fmt.Sprintf(baseURLFmt, nr.Link))
	}

	return links
}

// JSON-LD
type JsonLD struct {
	MainEntityOfPage string    `json:"mainEntityOfPage"`
	Headline         string    `json:"headline"`
	DatePublished    time.Time `json:"datePublished"`
	Description      string    `json:"description"`
	Image []struct {
		URL    string `json:"url"`
		Height int    `json:"height"`
		Width  int    `json:"width"`
	} `json:"image"`
}