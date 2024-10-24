package sqlite3

import (
	"database/sql"
	"log/slog"
	"sync"

	"ncrawler/internal/dto"

	_ "github.com/mattn/go-sqlite3"
)

var (
	rwInstanceOnce sync.Once
	rwInstance     *sql.DB
)

type TxFunction func(tx *sql.Tx) error

func GetInstance(config *dto.DBConfig) *sql.DB {
	return RwInstance(config)
}

func RwInstance(config *dto.DBConfig) *sql.DB {
	rwInstanceOnce.Do(func() {
		rwInstance = getInstance(config)
	})
	return rwInstance
}

func Close() {
	if rwInstance != nil {
		if err := rwInstance.Close(); err != nil {
			slog.Error("error closing RO database instance", "cause", err)
		}
	}
}

func getInstance(config *dto.DBConfig) *sql.DB {
	var (
		db  *sql.DB
		err error
	)

	db, err = sql.Open(config.DBDriver, config.DBPath)
	if err != nil {
		panic("problem getting db: " + err.Error())
	}
	// defer db.Close()

	return db
}

// WrapInTx starts a transaction on the given database instances, calls the
// given transaction function with a pointer to the transaction, and either commits
// or rolls back the transaction based on whether an error occurred or not. If the
// transaction function panics, the transaction is rolled back and the panic is
// propagated. The function returns an error if the transaction could not be started
// or committed/rolled back.
func WrapInTx(dbInstance *sql.DB, txFunc TxFunction) error {
	tx, err := dbInstance.Begin()
	if err != nil {
		return err
	}

	defer func() {
		if p := recover(); p != nil {
			err := tx.Rollback()
			if err != nil {
				slog.Error("problem during panic roll back", "cause", err)
			}
			panic(p)
		} else if err != nil {
			err := tx.Rollback()
			if err != nil {
				slog.Error("problem during error roll back", "cause", err)
			}
		} else {
			err = tx.Commit()
		}
	}()

	err = txFunc(tx)
	return err
}
