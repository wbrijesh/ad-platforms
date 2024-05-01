package google_handlers

import (
	"ad-platforms/helpers"
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/labstack/echo/v4"
	"io"
	"net/http"
)

type CampaignData struct {
	Name                   string     `json:"name"`
	Status                 string     `json:"status"`
	AdvertisingChannelType string     `json:"advertising_channel_type"`
	CampaignBudget         BudgetData `json:"campaign_budget"`

	// Targeting
	NetworkSettings NetworkSettingsData `json:"network_settings"`

	// Bidding
	BiddingStrategyType string         `json:"bidding_strategy_type"`
	BiddingStrategyID   int64          `json:"bidding_strategy_id"` // For existing strategies
	ManualCpc           *ManualCpcData `json:"manual_cpc"`          // If Manual CPC

	// Dates
	StartDate string `json:"start_date"` // Format: YYYY-MM-DD
	EndDate   string `json:"end_date"`

	// Ad Scheduling (Optional)
	AdSchedule []AdScheduleInfo `json:"ad_schedule"`

	// Other Settings
	FrequencyCaps           []FrequencyCap              `json:"frequency_caps"`
	OptimizationGoalSetting OptimizationGoalSettingData `json:"optimization_goal_setting"`
}

type BudgetData struct {
	Name               string `json:"name"`
	AmountMicros       int64  `json:"amount_micros"`
	DeliveryMethod     string `json:"delivery_method"`
	IsExplicitlyShared bool   `json:"is_explicitly_shared"`
}

type NetworkSettingsData struct {
	TargetGoogleSearch         bool `json:"target_google_search"`
	TargetSearchNetwork        bool `json:"target_search_network"`
	TargetContentNetwork       bool `json:"target_content_network"`
	TargetPartnerSearchNetwork bool `json:"target_partner_search_network"`
}

type ManualCpcData struct {
	EnhancedCpcEnabled bool `json:"enhanced_cpc_enabled"` // Optional
}

type AdScheduleInfo struct {
	DayOfWeek   string `json:"day_of_week"` // "MONDAY", "TUESDAY", etc.
	StartHour   int    `json:"start_hour"`  // 24-hour format
	EndHour     int    `json:"end_hour"`
	StartMinute int    `json:"start_minute"` // 0, 15, 30, 45
	EndMinute   int    `json:"end_minute"`
}

type FrequencyCap struct {
	Impressions int    `json:"impressions"`
	TimeUnit    string `json:"time_unit"` // "DAY", "WEEK", "MONTH"
	Level       string `json:"level"`     // "CAMPAIGN", "AD_GROUP", etc.
}

type OptimizationGoalSettingData struct {
	OptimizationGoalTypes []string `json:"optimization_goal_types"` // Example: ["CALL_CLICKS", "DRIVING_DIRECTIONS"]
}

func CreateGoogleAdsCampaign(c echo.Context) error {
	accessToken := c.Request().Header.Get("access_token")
	customerID := c.Request().Header.Get("customer_id")

	requestID := c.Response().Header().Get(echo.HeaderXRequestID)

	var campaignData CampaignData
	if err := c.Bind(&campaignData); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"success":                 "false",
			"message":                 "Error while binding request data",
			"data":                    "",
			"ad_platforms_request_id": requestID,
		})
	}

	apiUrl := fmt.Sprintf("https://googleads.googleapis.com/v16/%s/campaigns:mutate", customerID)

	fmt.Println("api url", apiUrl)

	// Request body
	requestBody := map[string]interface{}{
		"operations": []map[string]interface{}{
			{
				"create": campaignData,
			},
		},
	}
	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"success": "false",
			"message": "Error marshalling campaign data to JSON",
		})
	}

	// Create HTTP Request
	req, err := http.NewRequest("POST", apiUrl, bytes.NewBuffer(jsonBody))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"success": "false",
			"message": "Error creating HTTP request",
		})
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("developer-token", helpers.GetEnv("GOOGLE_ADS_DEVELOPER_TOKEN"))
	req.Header.Set("Content-Type", "application/json")

	// Send HTTP Request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"success":                 "false",
			"message":                 "Error sending request to Google Ads API",
			"data":                    "",
			"ad_platforms_request_id": requestID,
		})
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		bodyBytes, _ := io.ReadAll(resp.Body)
		fmt.Println("error:" + string(bodyBytes))
		return c.JSON(resp.StatusCode, map[string]string{
			"success":                 "false",
			"message":                 "Error from Google Ads API",
			"error":                   string(bodyBytes),
			"data":                    "",
			"ad_platforms_request_id": requestID,
		})
	}

	bodyBytes, _ := io.ReadAll(resp.Body)
	var apiResponse map[string]interface{}
	err = json.Unmarshal(bodyBytes, &apiResponse)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"success":                 "false",
			"message":                 "Error unmarshalling response from Google Ads API",
			"data":                    "",
			"ad_platforms_request_id": requestID,
		})
	}

	return c.JSON(
		http.StatusOK, map[string]interface{}{
			"success":                 "true",
			"message":                 "Google Campaign created successfully",
			"data":                    bodyBytes,
			"ad_platforms_request_id": requestID,
		})
}
