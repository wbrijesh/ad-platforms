package auth

import (
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"

	"ad-platforms/helpers"
)

func (h *BaseHandler) Signin(c echo.Context) error {
	db := h.db

	var user User
	err := c.Bind(&user)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"success": "false", "message": "Invalid request body", "token": ""})
	}

	userFromDatabase := User{}

	rows, err := db.Query(`SELECT * FROM users WHERE email = "` + user.Email + `"`)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"success": "false", "message": "Account with this email does not exist", "token": ""})
	}
	defer rows.Close()

	for rows.Next() {
		var user User
		err := rows.Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt, &user.FirstName, &user.LastName, &user.Email, &user.Password, &user.Role, &user.Verified)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"success": "false", "message": "Error while scanning user from database", "token": ""})
		}
		userFromDatabase = user
	}

	if !helpers.CheckPasswordHash(user.Password, userFromDatabase.Password) {
		return c.JSON(http.StatusBadRequest, map[string]string{"success": "false", "message": "Invalid password", "token": ""})
	}

	claims := &JwtCustomClaims{
		userFromDatabase.FirstName,
		userFromDatabase.LastName,
		userFromDatabase.Role,
		userFromDatabase.Verified,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 72)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	encodedToken, err := token.SignedString([]byte(helpers.GetEnv("JWT_SIGNING_KEY")))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"success": "false", "message": "Error while generating token", "token": ""})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"success": "true",
		"message": "User signed in successfully",
		"token":   encodedToken,
	})
}
