package helpers

import (
	"ncrawler/internal/datastores/pg"
	"ncrawler/internal/dto"

	_ "github.com/mattn/go-sqlite3"
)

// func GetDbPool() *sqlite3.Repositories {
// 	dbConfig := &dto.DBConfig{
// 		DBDriver: "sqlite3",
// 		DBPath:   "./db/news.db",
// 	}
// 	dbPool := sqlite3.GetInstance(dbConfig)
// 	return sqlite3.NewRepositories(dbPool)
// }

func GetDbPool() *pg.Repositories {
	dbConfig := &dto.DBConfig{
		User:     "postgres",
		Password: "docker",
		Address:  "localhost:5432",
		// Address:  "194.238.28.227:5432",
		Database: "news_manager",
	}
	dbPool := pg.GetInstance(dbConfig)
	return pg.NewRepositories(dbPool)
}
