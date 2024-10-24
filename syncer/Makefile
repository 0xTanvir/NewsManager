GOPATH := $(shell go env GOPATH)
BINARY_NAME=ncrawler
RELEASE_DIR=release
MIGRATE_BIN := $(GOPATH)/bin/migrate

$(MIGRATE_BIN):
	go install -tags 'sqlite3' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

install:
	go mod tidy
run:
	go run main.go sync
clean:
	go clean

migrate-up: $(MIGRATE_BIN)
	migrate -source file://db/migrations -database sqlite3://db/news.db -verbose up
migrate-down: $(MIGRATE_BIN)
	migrate -source file://db/migrations -database sqlite3://db/news.db -verbose down

# Build binaries for macOS and Windows with CGO enabled
build: clean
	GOOS=darwin GOARCH=amd64 CGO_ENABLED=1 go build -o $(RELEASE_DIR)/$(BINARY_NAME)-darwin main.go
	GOOS=windows GOARCH=amd64 CC=x86_64-w64-mingw32-gcc CGO_ENABLED=1 go build -o $(RELEASE_DIR)/$(BINARY_NAME)-windows.exe main.go

.PHONY: install run build clean migrate-up migrate-down
