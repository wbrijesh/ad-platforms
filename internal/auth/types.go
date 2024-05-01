package auth

import (
	"database/sql"
	"github.com/golang-jwt/jwt/v5"
)

type User struct {
	CreatedAt          string `json:"created_at"`
	UpdatedAt          string `json:"updated_at"`
	ID                 string `json:"id"`
	FirstName          string `json:"first_name"`
	LastName           string `json:"last_name"`
	Email              string `json:"email"`
	Password           string `json:"password"`
	Role               string `json:"role"`
	Verified           string `json:"verified"`
	GoogleRefreshToken string `json:"google_refresh_token"`
}

type JwtCustomClaims struct {
	ID        string `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Role      string `json:"role"`
	Verified  string `json:"verified"`
	jwt.RegisteredClaims
}

type BaseHandler struct {
	db *sql.DB
}
