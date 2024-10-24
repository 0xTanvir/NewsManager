package pg

import (
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repositories struct {
	// repositories
	News newsStore
}

func NewRepositories(pool *pgxpool.Pool) *Repositories {
	return &Repositories{
		News: newsStore{dbPool: pool},
	}
}
