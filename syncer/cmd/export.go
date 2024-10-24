package cmd

import (
	"fmt"
	"log/slog"
	"os"
	"strings"

	"ncrawler/pkg/helpers"

	"github.com/gocarina/gocsv"
	"github.com/spf13/cobra"
)

var (
	category string
	limit    int
)

// exportCmd represents the export command
var exportCmd = &cobra.Command{
	Use:   "export",
	Short: "Export the news data",
	Long:  `Export the news data to a file`,
	Run: func(cmd *cobra.Command, args []string) {
		err := exportCsv(category, limit)
		if err != nil {
			slog.Error("error at exporting news data", "error", err)
		}
	},
}

func init() {
	exportCmd.Flags().StringVarP(&category, "category", "c", "", "which category to export")
	exportCmd.Flags().IntVarP(&limit, "limit", "l", 0, "number of news to export")

	rootCmd.AddCommand(exportCmd)
}

func exportCsv(category string, limit int) error {
	dbPool := helpers.GetDbPool()
	newsStories, err := dbPool.News.GetNews(category, limit)
	if err != nil {
		return err
	}

	// Get the current timestamp and replace invalid characters for Windows
	timestamp := helpers.GetCurrentTimestamp()
	safeTimestamp := strings.ReplaceAll(timestamp, ":", "-")

	// generate file name with category, limit and timestamp
	fileName := fmt.Sprintf("news-%s-%d-%s.csv", category, limit, safeTimestamp)

	csvFile, err := os.OpenFile(fileName, os.O_RDWR|os.O_CREATE, os.ModePerm)
	if err != nil {
		return err
	}
	defer csvFile.Close()

	err = gocsv.MarshalFile(&newsStories, csvFile)
	if err != nil {
		return err
	}

	slog.Info("news data saved to", "file", fileName)

	return nil
}
