package definition

import (
	"ncrawler/internal/dto"
)

type Downloader interface {
	// DownloadImage(url string) (imageData []byte, err error)
}

type Source interface {
	GetLatest() ([]dto.News, error)

	// Downloader implements the downloader for the store
	Downloader
}

type Crawler interface {
	Sync(source Source) error
}
