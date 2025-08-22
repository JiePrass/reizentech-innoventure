package main

import (
	"database/sql"
	"log"
	"os"

	"github.com/Qodarrz/fiber-app/config"
	"github.com/Qodarrz/fiber-app/middleware"
	"github.com/Qodarrz/fiber-app/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func initEnv() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}
}

func initDatabase() *sql.DB {
	db, err := config.NewPostgresConnection(
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)
	if err != nil {
		log.Fatal(err)
	}
	return db
}

func main() {
	initEnv()

	db := initDatabase()
	defer db.Close()

	app := fiber.New(fiber.Config{
		AppName: "Fiber Auth App",
	})

	mw := middleware.InitMiddlewares(db) // misal JWT, Logger, dsb

	routes.Setup(app, db, mw)

	log.Fatal(app.Listen(":8080"))
}
