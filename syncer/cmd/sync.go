package cmd

import (
	"log/slog"

	"ncrawler/internal/crawler"

	"github.com/spf13/cobra"
)

// syncCmd represents the sync command
var syncCmd = &cobra.Command{
	Use:   "sync",
	Short: "Sync the news data",
	Long:  `Get the latest news and sync it with the database`,
	Run: func(cmd *cobra.Command, args []string) {
		crawler := crawler.GetCrawler()

		slog.Info("Starting news crawler")
		if err := crawler.Sync(); err != nil {
			slog.Error("Error at starting news crawler", "cause", err)
		}
	},
}

func init() {
	rootCmd.AddCommand(syncCmd)
}
