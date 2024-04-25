package main

import (
	"strconv"

	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"ad-platforms/internal/auth"
	"ad-platforms/internal/db"
	"ad-platforms/internal/server"
)

func main() {
	config := server.Config
	e := echo.New()
	database := db.GetDBConnection()

	authDbHandler := auth.NewBaseHandler(database)

	userRoutes := e.Group("/" + config.Version)
	authRoutes := e.Group("/" + config.Version)

	e.Use(middleware.CORS())
	userRoutes.Use(middleware.CORS())
	userRoutes.Use(echojwt.WithConfig(auth.JWTConfig))

	// publicly accessible routes
	e.GET("/health-check", server.HealthCheck)

	// protected routes
	authRoutes.POST("/register", authDbHandler.Register)
	authRoutes.POST("/signin", authDbHandler.Signin)

	e.Logger.Fatal(e.Start(":" + strconv.Itoa(config.Port)))
}
