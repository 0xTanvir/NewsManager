package pg

import (
	"context"
	"fmt"
	"strings"

	"ncrawler/internal/dto"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type newsStore struct {
	dbPool *pgxpool.Pool
}

func NewNewsStore(dbPool *pgxpool.Pool) *newsStore {
	return &newsStore{
		dbPool: dbPool,
	}
}

func (s *newsStore) DetectNewLinks(foundedLinks []string) ([]string, error) {
	if len(foundedLinks) == 0 {
		return nil, nil
	}

	// Build the query using plain SQL instead of prepared statement
	valueStrings := make([]string, 0, len(foundedLinks))
	valueArgs := make([]interface{}, 0, len(foundedLinks))

	for i, link := range foundedLinks {
		valueStrings = append(valueStrings, fmt.Sprintf("$%d", i+1))
		valueArgs = append(valueArgs, link)
	}

	query := fmt.Sprintf(`
		SELECT source_link 
		FROM news 
		WHERE source_link = ANY($1)`) // Use ANY instead of IN for better performance

	rows, err := s.dbPool.Query(context.Background(), query, foundedLinks)
	if err != nil {
		return nil, fmt.Errorf("error querying existing links: %w", err)
	}
	defer rows.Close()

	existingLinks := make(map[string]struct{})
	for rows.Next() {
		var link string
		if err := rows.Scan(&link); err != nil {
			return nil, fmt.Errorf("error scanning row: %w", err)
		}
		existingLinks[link] = struct{}{}
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over rows: %w", err)
	}

	newLinks := make([]string, 0, len(foundedLinks))
	for _, link := range foundedLinks {
		if _, exists := existingLinks[link]; !exists {
			newLinks = append(newLinks, link)
		}
	}

	return newLinks, nil
}

func (s *newsStore) AddNewsStories(newsStories []dto.News) error {
	if len(newsStories) == 0 {
		return nil
	}

	return WrapInTx(context.Background(), s.dbPool, func(tx pgx.Tx) error {
		// Create values string for bulk insert
		valueStrings := make([]string, 0, len(newsStories))
		valueArgs := make([]interface{}, 0, len(newsStories)*10)

		for i, news := range newsStories {
			base := i * 10
			valueStrings = append(valueStrings,
				fmt.Sprintf("($%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d)",
					base+1, base+2, base+3, base+4, base+5, base+6, base+7, base+8, base+9, base+10))

			// Convert BulletPoints to a proper PostgreSQL array if it's nil
			bulletPoints := news.BulletPoints
			if bulletPoints == nil {
				bulletPoints = []string{} // Convert nil to empty array for PostgreSQL
			}

			valueArgs = append(valueArgs,
				news.SourceName,
				news.Category,
				news.Headline,
				news.Story,
				news.ImageLink,
				news.SourceLink,
				news.MetaDescription,
				news.Summary,
				bulletPoints, // pgx will automatically handle the array conversion
				news.MetaKeywords,
			)
		}

		query := fmt.Sprintf(`
			INSERT INTO news (
				source_name, 
				category, 
				headline, 
				story,
				image_link, 
				source_link, 
				meta_description,
				summary,
				bullet_points,
				meta_keywords
			) VALUES %s`,
			strings.Join(valueStrings, ","))

		_, err := tx.Exec(context.Background(), query, valueArgs...)
		if err != nil {
			return fmt.Errorf("error executing bulk insert: %w", err)
		}

		return nil
	})
}
