package db

import "database/sql"

func CreateUsersTable(db *sql.DB) error {
	query := `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      created_at TEXT,
      updated_at TEXT,
      first_name TEXT,
      last_name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT,
      verified TEXT
    );
  `

	_, err := db.Exec(query)
	if err != nil {
		return err
	}
	return nil
}
