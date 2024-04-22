package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

func GetDBConnection() *sql.DB {
	config := DatabaseConfig
	db_connection_url := config.Host + "?authToken=" + config.Token

	db, err := sql.Open("libsql", db_connection_url)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to open db %s: %s", db_connection_url, err)
		os.Exit(1)
	} else {
		log.Println("Connected to db")
	}

	return db
}
