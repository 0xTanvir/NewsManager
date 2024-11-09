package definition

import (
	"ncrawler/internal/dto"
)

type Downloader interface {
	// DownloadImage(url string) (imageData []byte, err error)
}

type Source interface {
	// GetNewLatestLinks() ([]string, error)
	GetLatest() ([]dto.News, error)
	// GetName() string

	// Downloader implements the downloader for the store
	Downloader
}

type Crawler interface {
	Sync() error
}
