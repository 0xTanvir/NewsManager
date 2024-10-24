package pg

import (
	"context"
	"fmt"
	"log/slog"

	"ncrawler/internal/dto"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type newsStore struct {
	dbPool *pgxpool.Pool
}

const (
	insertNewsQuery = `INSERT INTO news (id, source_name, category, headline, story, published_at, image_link, source_link, meta_description, meta_keywords) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`
)

// GetNews retrieves all news stories from the database
func (s *newsStore) GetNews(ctgry string, limit int) ([]dto.News, error) {
	var (
		dbQuery string
		rows    pgx.Rows
		err     error
	)

	if limit == 0 {
		limit = 20
	}

	ctx := context.Background()

	if ctgry == "" {
		dbQuery = `SELECT id, source_name, category, headline, story, published_at, image_link, source_link, meta_description, meta_keywords FROM news ORDER BY published_at DESC LIMIT $1`
		rows, err = s.dbPool.Query(ctx, dbQuery, limit)
	} else {
		dbQuery = `SELECT id, source_name, category, headline, story, published_at, image_link, source_link, meta_description, meta_keywords FROM news WHERE category = $1 ORDER BY published_at DESC LIMIT $2`
		rows, err = s.dbPool.Query(ctx, dbQuery, ctgry, limit)
	}
	if err != nil {
		slog.Error("Error querying news", "cause", err)
		return nil, err
	}
	defer rows.Close()

	var newsStories []dto.News
	for rows.Next() {
		var news dto.News
		err := rows.Scan(
			&news.Id, &news.SourceName, &news.Category, &news.Headline,
			&news.Story, &news.Date, &news.ImageLink, &news.SourceLink,
			&news.MetaDescription, &news.MetaKeywords,
		)
		if err != nil {
			slog.Error("Error scanning news", "cause", err)
			return nil, err
		}
		newsStories = append(newsStories, news)
	}

	return newsStories, nil
}

// DetectNewLinks checks if the news stories exist based on the links (id)
func (s *newsStore) DetectNewLinks(foundedLinks []string) ([]string, error) {
	var newLinks []string
	ctx := context.Background()

	tx, err := s.dbPool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("error starting transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	for _, link := range foundedLinks {
		var exists bool
		err := tx.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM news WHERE id = $1)", link).Scan(&exists)
		if err != nil {
			return nil, fmt.Errorf("error checking existence of news ID %s: %w", link, err)
		}

		if !exists {
			newLinks = append(newLinks, link)
		}
	}

	err = tx.Commit(ctx)
	if err != nil {
		return nil, fmt.Errorf("error committing transaction: %w", err)
	}

	return newLinks, nil
}

// AddNewsStories adds news stories to the database
func (s *newsStore) AddNewsStories(newsStories []dto.News) (int, error) {
	var newNewsCount int
	ctx := context.Background()
	tx, err := s.dbPool.Begin(ctx)
	if err != nil {
		return 0, fmt.Errorf("error starting transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	for _, news := range newsStories {
		var exists bool
		err := tx.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM news WHERE id = $1)", news.Id).Scan(&exists)
		if err != nil {
			return 0, fmt.Errorf("error checking existence of news ID %s: %w", news.Id, err)
		}

		if !exists {
			_, err := tx.Exec(ctx, insertNewsQuery, news.Id, news.SourceName, news.Category, news.Headline, news.Story, news.Date, news.ImageLink, news.SourceLink, news.MetaDescription, news.MetaKeywords)
			if err != nil {
				return 0, fmt.Errorf("error inserting news ID %s: %w", news.Id, err)
			}
			newNewsCount++
		}
	}

	err = tx.Commit(ctx)
	if err != nil {
		return 0, fmt.Errorf("error committing transaction: %w", err)
	}

	return newNewsCount, nil
}

// GetCategoryList retrieves all unique categories from the database
func (s *newsStore) GetCategoryList() ([]string, error) {
	var categoryList []string
	ctx := context.Background()
	rows, err := s.dbPool.Query(ctx, `SELECT DISTINCT category FROM news`)
	if err != nil {
		slog.Error("Error querying categories", "cause", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var category string
		if err := rows.Scan(&category); err != nil {
			slog.Error("Error scanning category", "cause", err)
			return nil, err
		}
		categoryList = append(categoryList, category)
	}

	return categoryList, nil
}
