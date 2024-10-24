package cmd

import (
	"log/slog"
	"ncrawler/pkg/helpers"
	"strings"

	"github.com/spf13/cobra"
)

// categoriesCmd represents the categories command
var categoriesCmd = &cobra.Command{
	Use:   "categories",
	Short: "categories print all the categories",
	Long:  `Print all the categories available`,
	Run: func(cmd *cobra.Command, args []string) {
		dbPool := helpers.GetDbPool()

		categories, err := dbPool.News.GetCategoryList()
		if err != nil {
			slog.Error("error at getting categories", "error", err)
			return
		}

		slog.Info("available", "categories", strings.Join(categories, ", "))
	},
}

func init() {
	rootCmd.AddCommand(categoriesCmd)
}
