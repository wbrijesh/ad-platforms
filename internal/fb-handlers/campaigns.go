package fb_handlers

import (
	"ad-platforms/helpers"
	"github.com/labstack/echo/v4"
	"net/http"
)

func GetFbActiveCampaigns(c echo.Context) error {
	adAccountID := c.Request().Header.Get("ad_account_id")
	accessToken := c.Request().Header.Get("access_token")

	requestID := c.Response().Header().Get(echo.HeaderXRequestID)

	requestUrl := `https://graph.facebook.com/v19.0/` + adAccountID + `/campaigns?fields=name&access_token=` + accessToken + `&filtering=[{'field':'effective_status','operator':'IN','value':['ACTIVE']}]`
	data, err := helpers.FetchFromURL(requestUrl, nil)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"success": "false", "message": "Error while fetching campaigns", "data": ""})
	}

	return c.JSON(
		http.StatusOK, map[string]interface{}{
			"success":                 "true",
			"message":                 "Campaigns fetched successfully",
			"data":                    data,
			"ad_platforms_request_id": requestID,
		},
	)
}

func GetFbArchivedCampaigns(c echo.Context) error {
	adAccountID := c.Request().Header.Get("ad_account_id")
	accessToken := c.Request().Header.Get("access_token")

	requestID := c.Response().Header().Get(echo.HeaderXRequestID)

	requestUrl := `https://graph.facebook.com/v19.0/` + adAccountID + `/campaigns?fields=name&access_token=` + accessToken + `&filtering=[{'field':'effective_status','operator':'IN','value':['ARCHIVED']}]`
	data, err := helpers.FetchFromURL(requestUrl, nil)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"success": "false", "message": "Error while fetching campaigns", "data": ""})
	}

	return c.JSON(
		http.StatusOK, map[string]interface{}{
			"success":                 "true",
			"message":                 "Campaigns fetched successfully",
			"data":                    data,
			"ad_platforms_request_id": requestID,
		},
	)
}

func GetFbPausedCampaigns(c echo.Context) error {
	adAccountID := c.Request().Header.Get("ad_account_id")
	accessToken := c.Request().Header.Get("access_token")

	requestID := c.Response().Header().Get(echo.HeaderXRequestID)

	requestUrl := `https://graph.facebook.com/v19.0/` + adAccountID + `/campaigns?fields=name&access_token=` + accessToken + `&filtering=[{'field':'effective_status','operator':'IN','value':['PAUSED']}]`
	data, err := helpers.FetchFromURL(requestUrl, nil)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"success": "false", "message": "Error while fetching campaigns", "data": ""})
	}

	return c.JSON(
		http.StatusOK, map[string]interface{}{
			"success":                 "true",
			"message":                 "Campaigns fetched successfully",
			"data":                    data,
			"ad_platforms_request_id": requestID,
		},
	)
}
