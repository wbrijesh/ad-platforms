package db

import "github.com/labstack/echo/v4"

func DatabaseMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		c.Set("db", GetDBConnection())
		return next(c)
	}
}
