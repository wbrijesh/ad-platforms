package google_handlers

import (
	"ad-platforms/helpers"
	"context"
	"github.com/labstack/echo/v4"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"net/http"
)

func GenerateAccessFromRefreshToken(c echo.Context) error {
	refreshToken := c.Request().Header.Get("refresh_token")
	clientID := helpers.GetEnv("GOOGLE_ADS_CLIENT_ID")
	clientSecret := helpers.GetEnv("GOOGLE_ADS_CLIENT_SECRET")

	requestID := c.Response().Header().Get(echo.HeaderXRequestID)

	config := &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		Endpoint:     google.Endpoint,
	}

	tokenSource := config.TokenSource(context.Background(), &oauth2.Token{RefreshToken: refreshToken})

	newToken, err := tokenSource.Token()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"success": "false", "message": "Error while generating access token", "data": ""})
	}

	return c.JSON(
		http.StatusOK, map[string]interface{}{
			"success":                 "true",
			"message":                 "New access token generated successfully",
			"new_access_token":        newToken.AccessToken,
			"ad_platforms_request_id": requestID,
		},
	)
}
