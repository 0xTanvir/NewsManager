package prothomalo

import (
	"fmt"
	"log/slog"
	"ncrawler/internal/dto"
	"ncrawler/internal/sources"
	"net/url"
	"strings"
	"time"
)

type NewsResponse struct {
	CurrentHostURL string `json:"currentHostUrl"`
	PrimaryHostURL string `json:"primaryHostUrl"`
	HTTPStatusCode int    `json:"httpStatusCode"`
	PageType       string `json:"pageType"`
	Data           Data   `json:"data"`
	AppVersion     int    `json:"appVersion"`
	Title          string `json:"title"`
}

type Data struct {
	Collection Collection `json:"collection"`
}

type Collection struct {
	UpdatedAt int64  `json:"updated-at"`
	Slug      string `json:"slug"`
	Name      string `json:"name"`
	Items     []Item `json:"items"`
}

type Item struct {
	ID    string `json:"id"`
	Type  string `json:"type"`
	Story Story  `json:"story"`
}

type Story struct {
	UpdatedAt int64 `json:"updated-at"`
	Seo       struct {
		MetaDescription string   `json:"meta-description"`
		MetaKeywords    []string `json:"meta-keywords"`
	} `json:"seo"`
	AssigneeID int    `json:"assignee-id"`
	AuthorName string `json:"author-name"`
	Tags       []struct {
		Properties struct {
			Images          []interface{} `json:"images"`
			MetaTitle       string        `json:"meta-title"`
			MetaKeywords    string        `json:"meta-keywords"`
			MetaDescription string        `json:"meta-description"`
		} `json:"properties,omitempty"`
		Slug         string `json:"slug"`
		Name         string `json:"name"`
		Type         string `json:"type"`
		TagType      string `json:"tag-type"`
		EntityTypeID int    `json:"entity-type-id"`
		ID           int    `json:"id"`
	} `json:"tags"`
	Headline        string `json:"headline"`
	StoryContentID  string `json:"story-content-id"`
	Slug            string `json:"slug"`
	LastPublishedAt int64  `json:"last-published-at"`
	Sections        []struct {
		DomainSlug  interface{} `json:"domain-slug"`
		Slug        string      `json:"slug"`
		Name        string      `json:"name"`
		SectionURL  string      `json:"section-url"`
		ID          int         `json:"id"`
		ParentID    interface{} `json:"parent-id"`
		DisplayName string      `json:"display-name"`
		Collection  struct {
			Slug string `json:"slug"`
			Name string `json:"name"`
			ID   int    `json:"id"`
		} `json:"collection"`
		Data interface{} `json:"data"`
	} `json:"sections"`
	ReadTime          int    `json:"read-time"`
	ContentCreatedAt  int64  `json:"content-created-at"`
	IsEmbargoed       bool   `json:"is-embargoed"`
	OwnerName         string `json:"owner-name"`
	PublisherID       int    `json:"publisher-id"`
	HeroImageMetadata struct {
		Width      int    `json:"width"`
		Height     int    `json:"height"`
		MimeType   string `json:"mime-type"`
		FileSize   int    `json:"file-size"`
		FileName   string `json:"file-name"`
		FocusPoint []int  `json:"focus-point"`
	} `json:"hero-image-metadata"`
	WordCount            int      `json:"word-count"`
	PublishedAt          int64    `json:"published-at"`
	Summary              string   `json:"summary"`
	ExternalID           string   `json:"external-id"`
	CanonicalURL         string   `json:"canonical-url"`
	Status               string   `json:"status"`
	HeroImageAttribution string   `json:"hero-image-attribution"`
	BulletType           string   `json:"bullet-type"`
	ID                   string   `json:"id"`
	HeroImageS3Key       string   `json:"hero-image-s3-key"`
	Cards                []Card   `json:"cards"`
	URL                  string   `json:"url"`
	StoryVersionID       string   `json:"story-version-id"`
	ContentType          string   `json:"content-type"`
	ContentUpdatedAt     int64    `json:"content-updated-at"`
	AuthorID             int      `json:"author-id"`
	OwnerID              int      `json:"owner-id"`
	FirstPublishedAt     int64    `json:"first-published-at"`
	HeroImageCaption     string   `json:"hero-image-caption"`
	Version              int      `json:"version"`
	StoryTemplate        string   `json:"story-template"`
	CreatedAt            int64    `json:"created-at"`
	Authors              []Author `json:"authors"`
}

type Card struct {
	StoryElements    []StoryElement `json:"story-elements"`
	CardUpdatedAt    int64          `json:"card-updated-at"`
	ContentVersionID string         `json:"content-version-id"`
	CardAddedAt      int64          `json:"card-added-at"`
	Status           string         `json:"status"`
	ID               string         `json:"id"`
	ContentID        string         `json:"content-id"`
	Version          int            `json:"version"`
}

type StoryElement struct {
	Description string `json:"description"`
	PageURL     string `json:"page-url"`
	Type        string `json:"type"`
	FamilyID    string `json:"family-id"`
	Title       string `json:"title"`
	ID          string `json:"id"`
	Text        string `json:"text"`
}

type Author struct {
	Slug string `json:"slug"`
	Name string `json:"name"`
}

func (nr *NewsResponse) ToStories() []dto.News {
	var newsStories []dto.News

	for _, item := range nr.Data.Collection.Items {
		story := dto.News{
			Id:              item.Story.URL,
			SourceLink:      item.Story.URL,
			SourceName:      sources.SOURCE_PROTHOMALO,
			Category:        getCategory(item.Story.URL),
			Headline:        item.Story.Headline,
			ImageLink:       fmt.Sprintf(baseImageURLFmt, item.Story.HeroImageS3Key),
			Date:            getDateString(item.Story.PublishedAt),
			Story:           getStory(item.Story.Cards),
			MetaDescription: item.Story.Seo.MetaDescription,
			MetaKeywords:    strings.Join(item.Story.Seo.MetaKeywords, ", "),
		}

		newsStories = append(newsStories, story)
	}

	return newsStories
}

func getCategory(urlStr string) string {
	parsedURL, err := url.Parse(urlStr)
	if err != nil {
		slog.Error("error at parsing url", "cause", err)
		return ""
	}

	// Split the path and get the category
	pathSegments := strings.Split(parsedURL.Path, "/")
	if len(pathSegments) > 1 {
		return pathSegments[1]
	}

	return ""
}

func getDateString(timestamp int64) string {
	// The timestamp in milliseconds
	// Convert milliseconds to seconds
	seconds := timestamp / 1000

	// Convert to time.Time
	t := time.Unix(seconds, 0)

	// Format the time to a readable string
	return t.Format(time.RFC3339)
}

func getStory(cards []Card) string {
	var story string
	for _, card := range cards {
		for _, element := range card.StoryElements {
			story += element.Text
		}
	}

	return story
}
