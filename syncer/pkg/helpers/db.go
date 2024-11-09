package helpers

import (
	"ncrawler/internal/datastores/pg"
	"ncrawler/internal/dto"
	// _ "github.com/mattn/go-sqlite3"
)

// func GetDbPool() *sqlite3.Repositories {
// 	dbConfig := &dto.DBConfig{
// 		DBDriver: "sqlite3",
// 		DBPath:   "./db/news.db",
// 	}
// 	dbPool := sqlite3.GetInstance(dbConfig)
// 	return sqlite3.NewRepositories(dbPool)
// }

// PG local
// func GetDbPool() *pg.Repositories {
// 	dbConfig := &dto.DBConfig{
// 		User:     "postgres",
// 		Password: "docker",
// 		Address:  "localhost:5432",
// 		// Address:  "194.238.28.227:5432",
// 		Database: "news_manager",
// 		SSLMode: "disable",
// 	}
// 	dbPool := pg.GetInstance(dbConfig)
// 	return pg.NewRepositories(dbPool)
// }

func GetDbPool() *pg.Repositories {
	dbConfig := &dto.DBConfig{
		User:     "postgres.copydljxonwkcoumajtd",                 // Database > Settings > Database Settings > User
		Password: "pZj@vcmk9*fbTQ@",                               // Database > Settings > Database Settings > Password
		Address:  "aws-0-ap-southeast-1.pooler.supabase.com:6543", // Database > Settings > Connection Info > Host
		Database: "postgres",                                      // This is typically "postgres" for Supabase
		SSLMode:  "require",                                       // Supabase requires SSL
	}
	dbPool := pg.GetInstance(dbConfig)
	return pg.NewRepositories(dbPool)
}
