package dto

import (
	"regexp"
	"strings"
)

type News struct {
	Id              string   `json:"id" csv:"id"`
	SourceName      string   `json:"source_name" csv:"source_name"`
	Category        string   `json:"category" csv:"category"`
	Headline        string   `json:"headline" csv:"headline"`
	Story           string   `json:"story" csv:"story"`
	Summary         string   `json:"summary" csv:"summary"`
	BulletPoints    []string `json:"bullet_points" csv:"bullet_points"`
	Date            string   `json:"date" csv:"date"`
	ImageLink       string   `json:"image_link" csv:"image_link"`
	SourceLink      string   `json:"source_link" csv:"source_link"`
	MetaDescription string   `json:"meta_description" csv:"meta_description"`
	MetaKeywords    string   `json:"meta_keywords" csv:"meta_keywords"`
}

type NewsList []News

// sanitizeText cleans a single string by:
// - Trimming leading and trailing spaces
// - Replacing multiple spaces with a single space
// - Replacing multiple blank lines with a single blank line
func sanitizeText(text string) string {
	// Trim leading and trailing spaces
	text = strings.TrimSpace(text)

	// Replace multiple spaces with single space
	spaceRegex := regexp.MustCompile(`[^\S\n]+`)
	text = spaceRegex.ReplaceAllString(text, " ")

	// Replace multiple newlines with a single newline
	newlineRegex := regexp.MustCompile(`\n\s*\n`)
	text = newlineRegex.ReplaceAllString(text, "\n")

	return text
}

// Sanitize cleans all text fields in the NewsList
func (nl NewsList) Sanitize() {
	for i := range nl {
		// Sanitize all text fields
		nl[i].Headline = sanitizeText(nl[i].Headline)
		nl[i].Story = sanitizeText(nl[i].Story)
		nl[i].MetaDescription = sanitizeText(nl[i].MetaDescription)

		// Also sanitize URLs (just trim spaces as we don't want to modify the URL structure)
		nl[i].ImageLink = strings.TrimSpace(nl[i].ImageLink)
		nl[i].SourceLink = strings.TrimSpace(nl[i].SourceLink)
		nl[i].Date = strings.TrimSpace(nl[i].Date)
	}
}
