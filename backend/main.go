package main

import (
	generator "backend/src"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

type UserRegistrationRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
	Name     string `json:"name" binding:"required"`
	Role     string `json:"role" binding:"required"`
}

type UserLoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

var db *sql.DB
var jwtSecretKey []byte

func main() {

	var err error

	// Connect to the PostgreSQL database
	db, err = sql.Open("postgres", "user=postgres dbname=metryhub password=Muradikov_21 sslmode=disable")
	if err != nil {
		log.Fatal("Error connecting to the database: ", err)
	}
	defer db.Close()

	// Ensure the database is connected
	err = db.Ping()
	if err != nil {
		log.Fatal("Error pinging the database: ", err)
	}

	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Welcome to MetryHub"})
	})

	r.POST("/register", registerUser)

	r.POST("/login", loginUser)

	api := r.Group("/dashboard")
	api.Use(authMiddleware())
	{
		api.GET("/", dashboardRedirect)
	}

	r.Run()
}

func dashboardRedirect(c *gin.Context) {
	userEmail, _ := c.Get("email")
	userName, userRole := getUserDetails(userEmail.(string))

	switch userRole {
	case "admin":
		adminDashboard(c, userName, userRole)
	case "client":
		clientDashboard(c, userName, userRole)
	case "vendor":
		vendorDashboard(c, userName, userRole)
	default:
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
	}
}

func adminDashboard(c *gin.Context, userName, userRole string) {
	message := fmt.Sprintf("Welcome to the %s Dashboard %s", userRole, userName)
	c.JSON(http.StatusOK, gin.H{"message": message})
}

func clientDashboard(c *gin.Context, userName, userRole string) {
	message := fmt.Sprintf("Welcome to the %s Dashboard %s", userRole, userName)
	c.JSON(http.StatusOK, gin.H{"message": message})
}

func vendorDashboard(c *gin.Context, userName, userRole string) {
	message := fmt.Sprintf("Welcome to the %s Dashboard %s", userRole, userName)
	c.JSON(http.StatusOK, gin.H{"message": message})
}

func getUserDetails(email string) (string, string) {
	var name, role string
	err := db.QueryRow("SELECT users.name, roles.role_name FROM users JOIN roles ON users.role_id = roles.role_id WHERE users.email = $1", email).Scan(&name, &role)
	if err != nil {
		log.Printf("Error fetching user details: %v", err)
		return "", ""
	}
	return name, role
}

func registerUser(c *gin.Context) {
	var req UserRegistrationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	var roleID int
	err = db.QueryRow("SELECT role_id FROM roles WHERE role_name = $1", req.Role).Scan(&roleID)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid role"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error querying role"})
		}
		return
	}

	_, err = db.Exec("INSERT INTO users (email, password_hash, name, role_id) VALUES ($1, $2, $3, $4)",
		req.Email, string(hashedPassword), req.Name, roleID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Registration successful"})
}

func loginUser(c *gin.Context) {
	var req UserLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var dbPasswordHash string
	err := db.QueryRow("SELECT password_hash FROM users WHERE email = $1", req.Email).Scan(&dbPasswordHash)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		}
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(dbPasswordHash), []byte(req.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": req.Email,
	})

	jwtSecretKey, err = generator.GenerateSecretKey(64)
	if err != nil {
		log.Fatal("Failed to generate secret key: ", err)
	}

	tokenString, err := token.SignedString(jwtSecretKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to sign token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return jwtSecretKey, nil
		})

		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			userEmail := claims["email"].(string)
			var userRole string
			err := db.QueryRow("SELECT role_name FROM roles JOIN users ON roles.role_id = users.role_id WHERE users.email = $1", userEmail).Scan(&userRole)
			if err != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify user role"})
				return
			}

			c.Set("email", userEmail)
			c.Set("role", userRole)
		} else {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		c.Next()
	}
}

func requireRole(role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("role")
		if !exists || userRole != role {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
			return
		}
		c.Next()
	}
}
