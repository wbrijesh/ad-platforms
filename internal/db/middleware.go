package db

import (
	"database/sql"

	"github.com/labstack/echo/v4"
)

func DatabaseMiddleware(next echo.HandlerFunc, db *sql.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		c.Set("db", db)
		return next(c)
	}
}
