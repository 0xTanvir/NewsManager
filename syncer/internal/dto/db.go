package dto

type DBConfig struct {
	DBDriver string
	DBPath   string
	Logging  bool
	Migrate  bool

	User     string
	Password string
	Address  string
	Database string
	SSLMode  string
}
