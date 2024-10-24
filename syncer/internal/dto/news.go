package dto

type News struct {
	Id              string `json:"id" csv:"id"`
	SourceName      string `json:"source_name" csv:"source_name"`
	Category        string `json:"category" csv:"category"`
	Headline        string `json:"headline" csv:"headline"`
	Story           string `json:"story" csv:"story"`
	Date            string `json:"date" csv:"date"`
	ImageLink       string `json:"image_link" csv:"image_link"`
	SourceLink      string `json:"source_link" csv:"source_link"`
	MetaDescription string `json:"meta_description" csv:"meta_description"`
	MetaKeywords    string `json:"meta_keywords" csv:"meta_keywords"`
}
