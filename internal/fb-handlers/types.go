package fb_handlers

import "database/sql"

type BaseHandler struct {
	db *sql.DB
}
