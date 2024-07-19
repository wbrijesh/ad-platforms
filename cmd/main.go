package main

import (
	"ad-platforms/internal/auth"
	"ad-platforms/internal/db"
	fb_handlers "ad-platforms/internal/fb-handlers"
	google_handlers "ad-platforms/internal/google-handlers"
	"ad-platforms/internal/server"
	"log"
	"strconv"

	"github.com/labstack/echo-contrib/echoprometheus"
	"github.com/prometheus/client_golang/prometheus"

	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var testMetric = prometheus.NewCounter(
	prometheus.CounterOpts{
		Name: "test_metric",
		Help: "Just a test metric.",
	},
)

func init() {
	prometheus.MustRegister(testMetric)
}

func main() {
	config := server.Config
	middlewareConfig := server.GetMiddlewareConfig()
	e := echo.New()
	database := db.GetDBConnection()

	db.CreateUsersTable(database)

	authDbHandler := auth.NewBaseHandler(database)

	userRoutes := e.Group("/" + config.Version)
	authRoutes := e.Group("/" + config.Version)
	fbRoutes := userRoutes.Group("/fb")
	googleRoutes := userRoutes.Group("/google")

	e.Use(middleware.Logger())
	e.Use(middleware.CORS())
	e.Use(middleware.RequestID())
	e.Use(middleware.RateLimiterWithConfig(middlewareConfig))

	// from here

	customCounter := prometheus.NewCounter( // create new counter metric. This is replacement for `prometheus.Metric` struct
		prometheus.CounterOpts{
			Name: "custom_requests_total",
			Help: "How many HTTP requests processed, partitioned by status code and HTTP method.",
		},
	)
	if err := prometheus.Register(customCounter); err != nil { // register your new counter metric with default metrics registry
		log.Fatal(err)
	}

	// e.Use(echoprometheus.NewMiddleware("ad_platforms"))
	e.Use(echoprometheus.NewMiddlewareWithConfig(echoprometheus.MiddlewareConfig{
		Namespace: "ad_platforms",
		AfterNext: func(c echo.Context, err error) {
			customCounter.Inc() // use our custom metric in middleware. after every request increment the counter
		},
	}))
	e.GET("/metrics", echoprometheus.NewHandler())

	// to here

	userRoutes.Use(middleware.CORS())
	userRoutes.Use(echojwt.WithConfig(auth.JWTConfig))

	e.GET("/health-check", func(c echo.Context) error {
		err := server.HealthCheck(c, testMetric)
		if err != nil {
			return err
		}
		return nil
	})

	authRoutes.POST("/register", authDbHandler.Register)
	authRoutes.POST("/signin", authDbHandler.Signin)

	fbRoutes.GET("/ad-accounts", fb_handlers.GetAdAccounts)

	fbRoutes.GET("/campaigns-active", fb_handlers.GetFbActiveCampaigns)
	fbRoutes.GET("/campaigns-archived", fb_handlers.GetFbArchivedCampaigns)
	fbRoutes.GET("/campaigns-paused", fb_handlers.GetFbPausedCampaigns)

	//e.GET("/v1/google/campaigns", func(c echo.Context) error {
	//	return c.JSON(200, map[string]string{"message": "Google campaigns fetched successfully"})
	//})
	googleRoutes.GET("/campaigns", google_handlers.GetGoogleCampaigns)
	googleRoutes.POST("/create-campaign", google_handlers.CreateGoogleAdsCampaign)
	googleRoutes.GET("/new-access-token", google_handlers.GenerateAccessFromRefreshToken)

	// health check route
	e.GET("/health-check", func(c echo.Context) error {
		return c.JSON(200, map[string]string{"message": "Server is running"})
	})

	e.Logger.Fatal(e.Start(":" + strconv.Itoa(config.Port)))
}
