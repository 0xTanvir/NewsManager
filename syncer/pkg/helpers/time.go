package helpers

import "time"

func GetCurrentTimestamp() string {
	return time.Now().Format(time.RFC3339)
}

func TimeToStr(t time.Time) string {
	return t.Format(time.RFC3339)
}
