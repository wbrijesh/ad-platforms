package fb_handlers

import (
	"ad-platforms/helpers"
	"github.com/labstack/echo/v4"
	"net/http"
)

func GetAdAccounts(c echo.Context) error {
	accessToken := c.Request().Header.Get("access_token")

	requestID := c.Response().Header().Get(echo.HeaderXRequestID)

	requestUrl := `https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name,account_id&access_token=` + accessToken
	data, err := helpers.FetchFromURL(requestUrl, nil)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"success": "false", "message": "Error while fetching ad accounts", "data": ""})
	}

	return c.JSON(
		http.StatusOK, map[string]interface{}{
			"success":                 "true",
			"message":                 "Ad accounts fetched successfully",
			"ad_accounts":             data,
			"ad_platforms_request_id": requestID,
		},
	)
}
