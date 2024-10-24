package sqlite3

import "database/sql"

type Repositories struct {
	// repositories
	News newsStore
}

func NewRepositories(sqlDb *sql.DB) *Repositories {
	return &Repositories{
		News: newsStore{db: sqlDb},
	}
}
