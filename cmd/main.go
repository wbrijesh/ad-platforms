package main

import (
	"strconv"

	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"

	"ad-platforms/internal/auth"
	"ad-platforms/internal/db"
	"ad-platforms/internal/server"
)

func main() {
	config := server.Config
	e := echo.New()
	database := db.GetDBConnection()

	userRoutes := e.Group("/" + config.Version)
	userRoutes.Use(echojwt.WithConfig(auth.JWTConfig))

	userRoutes.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return db.DatabaseMiddleware(next, database)
	})

	// publicly accessible routes
	e.GET("/health-check", server.HealthCheck)

	// protected routes
	userRoutes.POST("/register", auth.Register)

	e.Logger.Fatal(e.Start(":" + strconv.Itoa(config.Port)))
}
