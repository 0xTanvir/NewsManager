package helpers

import "strings"

func CleanHtml(html string) string {
	// Clean the html
	html = strings.ReplaceAll(html, "\n", "")
	html = strings.ReplaceAll(html, `\`, "")
	return html
}
