package reuters

import (
	"fmt"
	"time"
)

type NewsResponse struct {
	StatusCode int    `json:"statusCode"`
	Message    string `json:"message"`
	Result     struct {
		DateModified time.Time `json:"date_modified"`
		FetchType    string    `json:"fetch_type"`
		AdUnitPath   string    `json:"ad_unit_path"`
		Articles     []struct {
			ID              string    `json:"id"`
			CanonicalURL    string    `json:"canonical_url"`
			BasicHeadline   string    `json:"basic_headline"`
			Title           string    `json:"title"`
			Description     string    `json:"description"`
			Web             string    `json:"web"`
			HeadlineFeature string    `json:"headline_feature,omitempty"`
			ContentCode     string    `json:"content_code"`
			UpdatedTime     time.Time `json:"updated_time"`
			PublishedTime   time.Time `json:"published_time"`
		} `json:"articles"`
	} `json:"result"`
	ID string `json:"_id"`
}

func (nr NewsResponse) toLinks() []string {
	links := []string{}
	for _, nr := range nr.Result.Articles {
		links = append(links, fmt.Sprintf(baseURLFmt, nr.CanonicalURL))
	}

	return links
}

// JSON-LD
type JsonLD struct {
	Image          []string  `json:"image"`
	ArticleSection string    `json:"articleSection"`
	Keywords       []string  `json:"keywords"`
	Headline       string    `json:"headline"`
	Description    string    `json:"description"`
	DateCreated    time.Time `json:"dateCreated"`
	DatePublished  time.Time `json:"datePublished"`
	DateModified   time.Time `json:"dateModified"`
}
