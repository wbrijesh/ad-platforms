package db

import "ads-platform/helpers"

var DatabaseConfig = DatabaseConfigType{
	Host:  helpers.GetEnv("DB_HOST"),
	Token: helpers.GetEnv("DB_TOKEN"),
}
