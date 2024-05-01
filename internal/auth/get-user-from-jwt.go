package auth

import (
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"

	"log"
)

//type JwtCustomClaims struct {
//	ID       string `json:"id"`
//	Role     string `json:"role"`
//	Verified string `json:"verified"`
//	jwt.RegisteredClaims
//}

func ParseJWT(tokenString string) (user User, err error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("JWT_SIGNING_KEY")
		return []byte("JWT_SIGNING_KEY"), nil
	})
	if err != nil {
		log.Fatal(err)
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		user = User{
			ID:       claims["id"].(string),
			Role:     claims["role"].(string),
			Verified: claims["verified"].(string),
		}

		return user, nil
	} else {
		return User{}, err
	}

}

func GetUserFromJWT(c echo.Context) (User, error) {
	// Get the JWT from the Authorization header
	jwtVar := c.Request().Header.Get("Authorization")
	// Parse the JWT and get the user
	user, err := ParseJWT(jwtVar)
	if err != nil {
		return User{}, err
	}
	return user, nil
}
