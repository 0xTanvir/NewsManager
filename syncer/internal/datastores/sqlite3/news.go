package sqlite3

import (
	"database/sql"
	"fmt"
	"log/slog"

	"ncrawler/internal/dto"
)

type newsStore struct {
	db *sql.DB
}

const (
	insertNewsQuery = `INSERT INTO news (id, source_name, category, headline, story, published_at, image_link, source_link, meta_description, meta_keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
)

// GetNews retrieves all news stories from the database
func (s *newsStore) GetNews(ctgry string, limit int) ([]dto.News, error) {
	var (
		dbQuery string
		rows    *sql.Rows
		err     error

		id              sql.NullString
		sourceName      sql.NullString
		category        sql.NullString
		headline        sql.NullString
		story           sql.NullString
		publishedAt     sql.NullString
		imageLink       sql.NullString
		sourceLink      sql.NullString
		metaDescription sql.NullString
		metaKeywords    sql.NullString
	)

	if limit == 0 {
		limit = 20
	}

	if ctgry == "" {
		dbQuery = `SELECT id, source_name, category, headline, story, published_at, image_link, source_link, meta_description, meta_keywords FROM news ORDER BY published_at DESC LIMIT ?`
		rows, err = s.db.Query(dbQuery, limit)
	} else {
		dbQuery = `SELECT id, source_name, category, headline, story, published_at, image_link, source_link, meta_description, meta_keywords FROM news WHERE category = ? ORDER BY published_at DESC LIMIT ?`
		rows, err = s.db.Query(dbQuery, ctgry, limit)
	}
	if err != nil {
		slog.Error("Error querying options", "cause", err)
		return nil, err
	}
	defer rows.Close()

	newsStories := []dto.News{}
	for rows.Next() {
		if err := rows.Scan(&id, &sourceName, &category, &headline, &story, &publishedAt, &imageLink, &sourceLink, &metaDescription, &metaKeywords); err != nil {
			slog.Error("Error scanning options", "cause", err)
			return nil, err
		}

		newsStories = append(newsStories, dto.News{
			Id:              id.String,
			SourceName:      sourceName.String,
			Category:        category.String,
			Headline:        headline.String,
			Story:           story.String,
			Date:            publishedAt.String,
			ImageLink:       imageLink.String,
			SourceLink:      sourceLink.String,
			MetaDescription: metaDescription.String,
			MetaKeywords:    metaKeywords.String,
		})
	}

	return newsStories, nil
}

// AddNewsStories adds news stories to the database
func (s *newsStore) DetectNewLinks(foundedLinks []string) ([]string, error) {
	var newLinks []string
	err := WrapInTx(s.db, func(tx *sql.Tx) error {
		for _, link := range foundedLinks {
			// Check if the news story already exists based on the ID (link)
			var exists bool
			err := tx.QueryRow("SELECT EXISTS(SELECT 1 FROM news WHERE id = ?)", link).Scan(&exists)
			if err != nil {
				return fmt.Errorf("error checking existence of news ID %s: %w", link, err)
			}

			// If the news story doesn't exist, insert it
			if !exists {
				newLinks = append(newLinks, link)
			}
		}
		return nil
	})

	return newLinks, err
}

// AddNewsStories adds news stories to the database
func (s *newsStore) AddNewsStories(newsStories []dto.News) (int, error) {
	var newNewsCount int
	err := WrapInTx(s.db, func(tx *sql.Tx) error {
		for _, news := range newsStories {
			// Check if the news story already exists based on the ID (link)
			var exists bool
			err := tx.QueryRow("SELECT EXISTS(SELECT 1 FROM news WHERE id = ?)", news.Id).Scan(&exists)
			if err != nil {
				return fmt.Errorf("error checking existence of news ID %s: %w", news.Id, err)
			}

			// If the news story doesn't exist, insert it
			if !exists {
				_, err := tx.Exec(insertNewsQuery, news.Id, news.SourceName, news.Category, news.Headline, news.Story, news.Date, news.ImageLink, news.SourceLink, news.MetaDescription, news.MetaKeywords)
				if err != nil {
					return fmt.Errorf("error inserting news ID %s: %w", news.Id, err)
				}
				newNewsCount++
			}
		}
		return nil
	})

	return newNewsCount, err
}

// GetCategoryList retrieves all unique categories from the database
func (s *newsStore) GetCategoryList() ([]string, error) {
	var categoryList []string
	dbQuery := `SELECT DISTINCT category FROM news`
	rows, err := s.db.Query(dbQuery)
	if err != nil {
		slog.Error("Error querying options", "cause", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var category sql.NullString
		if err := rows.Scan(&category); err != nil {
			slog.Error("Error scanning options", "cause", err)
			return nil, err
		}

		categoryList = append(categoryList, category.String)
	}

	return categoryList, nil
}
