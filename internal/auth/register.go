package auth

import (
	"database/sql"
	"net/http"
	"time"

	"ads-platform/helpers"

	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

// type User struct {
// 	CreatedAt time.Time `json:"created_at"`
// 	UpdatedAt time.Time `json:"updated_at"`
// 	ID        string    `json:"id"`
// 	FirstName string    `json:"first_name"`
// 	LastName  string    `json:"last_name"`
// 	Email     string    `json:"email"`
// 	Password  string    `json:"password"`
// 	Role      string    `json:"role"`
// 	Verified  bool      `json:"verified"`
// }

func Register(c echo.Context) error {
	db := c.Get("db").(*sql.DB)

	var user User

	err := c.Bind(&user)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid request body"})
	}

	existingUser := db.QueryRow("SELECT * FROM users WHERE email = ?", user.Email)
	if existingUser.Scan(&user) != sql.ErrNoRows {
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
	_, err = db.Exec(createUserQuery, user.ID, user.FirstName, user.LastName, user.Email, user.Password, "user", "false")

	return c.JSON(http.StatusOK, map[string]string{"error": "Error while creating user"})
}
