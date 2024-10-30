package theguardian

import "strings"

type NewsResponse struct {
	Tabs []struct {
		Heading string `json:"heading"`
		Trails  []struct {
			URL string `json:"url"`
		} `json:"trails"`
	} `json:"tabs"`
}

func (nr NewsResponse) toLinks() []string {
	links := []string{}

	for _, tab := range nr.Tabs {
		if !strings.Contains(tab.Heading, "Across") {
			for _, trail := range tab.Trails {
				l := strings.ReplaceAll(trail.URL, "https://www.theguardian.com", "https://api.nextgen.guardianapps.co.uk")
				l += ".json"
				links = append(links, l)
			}
		}
	}

	return links
}

type articleResponse struct {
	Config struct {
		Page struct {
			IsLive bool `json:"isLive"`
		} `json:"page"`
	} `json:"config"`
	HTML string `json:"html"`
}
