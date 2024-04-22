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

func Register(c echo.Context) error {
	db := c.Get("db").(*sql.DB)

	var user User

	err := c.Bind(&user)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid request body"})
	}

	existingUser := db.QueryRow("SELECT * FROM users WHERE email = ?", user.Email)
	if existingUser.Scan(&user) != sql.ErrNoRows {
		fmt.Println(existingUser.Scan(&user))
		return c.JSON(
			http.StatusBadRequest,
			map[string]string{
				"message": "User with this email already exists",
			},
		)
	}

	hashedPassword, err := helpers.HashPassword(user.Password)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error while hashing password"})
	}
	user.ID = helpers.GenerateUUID()
	user.Password = hashedPassword

	createUserQuery := `
    INSERT INTO users (id, first_name, last_name, email, password, role, verified)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `
	_, err = db.Exec(createUserQuery, user.ID, user.FirstName, user.LastName, user.Email, user.Password, user.Role, user.Verified)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error while inserting in database"})
	}

	claims := &JwtCustomClaims{
		user.FirstName,
		user.LastName,
		user.Role,
		user.Verified,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 72)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	encodedToken, err := token.SignedString([]byte("ad-platforms-secret-key"))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error while generating token"})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "User created successfully",
		"token":   encodedToken,
	})
}
