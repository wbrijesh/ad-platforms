package auth

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type User struct {
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	ID        string    `json:"id"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	Role      string    `json:"role"`
	Verified  bool      `json:"verified"`
}

type JwtCustomClaims struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Role      string `json:"role"`
	Verified  bool   `json:"verified"`
	jwt.RegisteredClaims
}
