package bbc

import (
	"fmt"
	"strings"
	"time"
)

type NewsResponse struct {
	Page     int `json:"page"`
	PageSize int `json:"pageSize"`
	Total    int `json:"total"`
	Data     []struct {
		Path    string   `json:"path"`
		ID      string   `json:"id"`
		Type    string   `json:"type"`
		Subtype string   `json:"subtype"`
		Title   string   `json:"title"`
		Summary string   `json:"summary"`
		Topics  []string `json:"topics"`
		State   string   `json:"state"`
	} `json:"data"`
}

func (nr NewsResponse) toLinks() []string {
	links := []string{}
	for _, nr := range nr.Data {
		if !strings.Contains(nr.Path, "/news/videos/") {
			links = append(links, fmt.Sprintf(baseURLFmt, nr.Path))
		}
	}

	return links
}

// JSON-LD
type JsonLD struct {
	URL           string    `json:"url"`
	DatePublished time.Time `json:"datePublished"`
	DateModified  time.Time `json:"dateModified"`
	Description   string    `json:"description"`
	Headline      string    `json:"headline"`
	Image         struct {
		URL string `json:"url"`
	} `json:"image"`
	ThumbnailURL     string `json:"thumbnailUrl"`
	MainEntityOfPage string `json:"mainEntityOfPage"`
}
