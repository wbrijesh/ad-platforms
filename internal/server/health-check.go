package server

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func HealthCheck(c echo.Context) error {
	response := ResponseType{
		Result: "OK",
		Error:  "",
	}
	return c.JSON(http.StatusOK, response)
}
