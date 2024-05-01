package server

import (
	"github.com/prometheus/client_golang/prometheus"
	"net/http"

	"github.com/labstack/echo/v4"
)

func HealthCheck(c echo.Context, testMetric prometheus.Counter) error {
	requestID := c.Response().Header().Get(echo.HeaderXRequestID)
	response := ResponseType{
		Result:    "OK",
		Error:     "",
		RequestID: requestID,
	}

	testMetric.Inc()

	return c.JSON(http.StatusOK, response)
}
