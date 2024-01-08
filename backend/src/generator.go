package generator

import (
	"crypto/rand"
	"crypto/sha1"
	"encoding/base64"

	"github.com/google/uuid"
)

func GenerateSecretKey(length int) ([]byte, error) {
	key := make([]byte, length)
	_, err := rand.Read(key)
	if err != nil {
		return nil, err
	}
	return key, nil
}

func GenerateShortDeviceToken() string {
	uuidString := uuid.New().String()

	hasher := sha1.New()
	hasher.Write([]byte(uuidString))
	hashBytes := hasher.Sum(nil)

	encoded := base64.URLEncoding.EncodeToString(hashBytes)
	return encoded
}
