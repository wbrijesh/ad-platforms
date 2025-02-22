package auth

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"

	"ad-platforms/helpers"
)

func NewBaseHandler(db *sql.DB) *BaseHandler {
	return &BaseHandler{
		db: db,
	}
}

func (h *BaseHandler) Register(c echo.Context) error {
	db := h.db
	requestID := c.Response().Header().Get(echo.HeaderXRequestID)

	var user User

	err := c.Bind(&user)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"success": "false", "message": "Invalid request body", "token": "", "ads_platform_request_id": requestID})
	}

	existingUser := db.QueryRow("SELECT * FROM users WHERE email = ?", user.Email)
	if existingUser.Scan(&user) != sql.ErrNoRows {
		fmt.Println(existingUser.Scan(&user))
		return c.JSON(
			http.StatusBadRequest,
			map[string]string{
				"success":                 "true",
				"message":                 "User with this email already exists",
				"token":                   "",
				"ads_platform_request_id": requestID,
			},
		)
	}

	hashedPassword, err := helpers.HashPassword(user.Password)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"success": "false", "message": "Error while hashing password", "token": "", "ads_platform_request_id": requestID})
	}
	user.ID = helpers.GenerateUUID()
	user.Password = hashedPassword

	createUserQuery := `
    INSERT INTO users (id, first_name, last_name, email, password, role, verified, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `
	_, err = db.Exec(createUserQuery, user.ID, user.FirstName, user.LastName, user.Email, user.Password, user.Role, user.Verified, time.Now().String(), time.Now().String())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"success": "false", "message": "Error while inserting in database", "token": "", "ads_platform_request_id": requestID})
	}

	claims := &JwtCustomClaims{
		user.ID,
		user.FirstName,
		user.LastName,
		user.Role,
		user.Verified,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 72)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	encodedToken, err := token.SignedString([]byte(helpers.GetEnv("JWT_SIGNING_KEY")))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"success": "false", "message": "Error while generating token", "token": "", "ads_platform_request_id": requestID})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"success":                 "true",
		"message":                 "User created successfully",
		"token":                   encodedToken,
		"ads_platform_request_id": requestID,
	})
}
