package server

import "database/sql"

type ServerConfigType struct {
	Version string
	Port    int
}

type ResponseType struct {
	Result    interface{}
	Error     string
	RequestID string
}

type BaseHandler struct {
	db *sql.DB
}
