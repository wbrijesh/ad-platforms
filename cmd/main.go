package main

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"

	"ads-platform/internal/db"
	"ads-platform/internal/server"
)

func main() {
	config := server.Config
	e := echo.New()

	// database := db.GetDBConnection()
	// e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
	// 	return func(c echo.Context) error {
	// 		c.Set(databaseKey, database)
	// 		return next(c)
	// 	}
	// })

	e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return db.DatabaseMiddleware(next)
	})

	e.GET("/"+config.Version+"/health-check", func(c echo.Context) error {
		response := server.ResponseType{
			Result: "OK",
			Error:  "",
		}

		return c.JSON(http.StatusOK, response)
	})

	e.Logger.Fatal(e.Start(":" + strconv.Itoa(config.Port)))
}
