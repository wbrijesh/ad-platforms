package main

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"

	"ad-platforms/internal/auth"
	"ad-platforms/internal/db"
	"ad-platforms/internal/server"
)

func main() {
	config := server.Config
	e := echo.New()

	database := db.GetDBConnection()

	e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return db.DatabaseMiddleware(next, database)
	})

	e.GET("/"+config.Version+"/health-check", func(c echo.Context) error {
		response := server.ResponseType{
			Result: "OK",
			Error:  "",
		}

		return c.JSON(http.StatusOK, response)
	})

	e.POST("/"+config.Version+"/register", auth.Register)

	e.Logger.Fatal(e.Start(":" + strconv.Itoa(config.Port)))
}
