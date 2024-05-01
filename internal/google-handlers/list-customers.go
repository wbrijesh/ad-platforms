package google_handlers

import (
	"ad-platforms/helpers"
	"github.com/labstack/echo/v4"
	"net/http"
)

func GetGoogleCampaigns(c echo.Context) error {
	accessToken := c.Request().Header.Get("access_token")

	requestID := c.Response().Header().Get(echo.HeaderXRequestID)

	requestUrl := `https://googleads.googleapis.com/v16/customers:listAccessibleCustomers`
	headersArr := map[string]string{
		"Authorization":   "Bearer " + accessToken,
		"developer-token": helpers.GetEnv("GOOGLE_ADS_DEVELOPER_TOKEN"),
	}
	data, err := helpers.FetchFromURL(requestUrl, headersArr)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"success": "false", "message": "Error while fetching campaigns", "data": ""})
	}

	return c.JSON(
		http.StatusOK, map[string]interface{}{
			"success":                 "true",
			"message":                 "Google Campaigns fetched successfully",
			"data":                    data,
			"ad_platforms_request_id": requestID,
		},
	)
}
