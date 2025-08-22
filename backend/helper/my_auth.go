package helpers

import (
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"crypto/rand"
	"encoding/hex"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

type JWTClaims struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

func GetUserClaims(c *fiber.Ctx) *JWTClaims {
	u := c.Locals("user")
	if u == nil {
		return nil
	}

	token, ok := u.(*jwt.Token)
	if !ok || token == nil {
		return nil
	}

	claims, ok := token.Claims.(*JWTClaims)
	if !ok {
		return nil
	}

	return claims
}

func GenerateEmailVerificationToken(userID, email string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"email":   email,
		"exp":     time.Now().Add(1 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_EMAIL_SECRET")))
}

func GenerateJWT(userID string) (string, error) {
	now := time.Now()

	claims := JWTClaims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(60 * time.Minute)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}

	parts := strings.Split(signedToken, ".")
	if len(parts) != 3 {
		return "", fmt.Errorf("generated token has %d parts, expected 3", len(parts))
	}

	return signedToken, nil
}

// GenerateRandomToken menghasilkan token acak dengan panjang n byte
func GenerateRandomToken(n int) string {
	bytes := make([]byte, n)
	_, err := rand.Read(bytes)
	if err != nil {
		// fallback kalau ada error, meskipun sebaiknya error ini ditangani
		return ""
	}
	return hex.EncodeToString(bytes)
}

func DecodeJWT(tokenStr string) (int64, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		// pastikan method signing sesuai
		return []byte(os.Getenv("JWT_EMAIL_SECRET")), nil
	})
	if err != nil || !token.Valid {
		return 0, errors.New("token tidak valid")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return 0, errors.New("tidak bisa membaca claims")
	}

	userIDStr, ok := claims["user_id"].(string)
	if !ok {
		return 0, errors.New("user_id tidak ada di token")
	}

	userID, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil {
		return 0, errors.New("user_id token invalid")
	}

	return userID, nil
}
