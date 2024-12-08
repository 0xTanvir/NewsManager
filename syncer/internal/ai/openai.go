package ai

import (
	"context"
	"encoding/json"
	"fmt"
	"ncrawler/internal/dto"

	"github.com/sashabaranov/go-openai"
)

type ArticleSummary struct {
	Metadata struct {
		Source             string   `json:"source"`
		VerificationStatus string   `json:"verificationStatus"`
		Categories         []string `json:"categories"`
	} `json:"metadata"`
	Summary   string   `json:"summary"`
	KeyPoints []string `json:"key_points"`
}

func GetSummary(news dto.News) (*ArticleSummary, error) {
	ctx := context.Background()
	client := openai.NewClient(OPENAI_API_KEY)
	// setup the messages
	messages := []openai.ChatCompletionMessage{
		{Role: openai.ChatMessageRoleSystem, Content: SYSTEM_PROMPT},
		{Role: openai.ChatMessageRoleUser, Content: fmt.Sprintf("Source: %s\nHeadline: %s\nStory: %s", news.SourceName, news.Headline, news.Story)},
	}

	resp, err := client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model:          "gpt-4o-mini-2024-07-18",
			Messages:       messages,
			ResponseFormat: getResponseFormat(),
			Temperature:    0.0,
		},
	)
	if err != nil {
		return nil, err
	}

	as := &ArticleSummary{}
	err = json.Unmarshal([]byte(resp.Choices[0].Message.Content), as)
	if err != nil {
		fmt.Println(err)
	}

	return as, nil
}

func getResponseFormat() *openai.ChatCompletionResponseFormat {
	return &openai.ChatCompletionResponseFormat{
		Type: openai.ChatCompletionResponseFormatTypeJSONSchema,
		JSONSchema: &openai.ChatCompletionResponseFormatJSONSchema{
			Name:   "article_summary",
			Strict: false,
			Schema: &ArticleSummarySchema{},
		},
	}
}

// ArticleSummarySchema implements json.Marshaler interface
type ArticleSummarySchema struct{}

// MarshalJSON implements the json.Marshaler interface
func (s *ArticleSummarySchema) MarshalJSON() ([]byte, error) {
	schema := map[string]interface{}{
		"type": "object",
		"required": []string{
			"metadata",
			"summary",
			"key_points",
		},
		"properties": map[string]interface{}{
			"metadata": map[string]interface{}{
				"type": "object",
				"required": []string{
					"source",
					"categories",
					"verificationStatus",
				},
				"properties": map[string]interface{}{
					"source": map[string]interface{}{
						"type": "string",
					},
					"categories": map[string]interface{}{
						"type": "array",
						"items": map[string]interface{}{
							"type": "string",
						},
					},
					"verificationStatus": map[string]interface{}{
						"type": "string",
						"enum": []string{
							"VERIFIED",
							"UNVERIFIED",
							"PENDING",
						},
					},
				},
			},
			"summary": map[string]interface{}{
				"type": "string",
			},
			"key_points": map[string]interface{}{
				"type": "array",
				"items": map[string]interface{}{
					"type": "string",
				},
			},
		},
	}

	return json.Marshal(schema)
}
