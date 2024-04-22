package db

import "ad-platforms/helpers"

var DatabaseConfig = DatabaseConfigType{
	Host:  helpers.GetEnv("DB_HOST"),
	Token: helpers.GetEnv("DB_TOKEN"),
}
