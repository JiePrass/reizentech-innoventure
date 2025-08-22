package routes

import (
	"database/sql"

	"github.com/Qodarrz/fiber-app/controller"
	"github.com/Qodarrz/fiber-app/middleware"
	"github.com/Qodarrz/fiber-app/repository"
	"github.com/Qodarrz/fiber-app/service"
	"github.com/gofiber/fiber/v2"
)
func Setup(app *fiber.App, db *sql.DB, mw *middleware.Middlewares) {
	// Initialize services
	authService := service.NewAuthService(
		repository.NewUserRepository(db),
		repository.NewActivityRepository(db),
		
	)

	carbonService := service.NewCarbonService(
		repository.NewCarbonRepository(db),
	)

	// Initialize controllers
	controller.InitAuthController(app, authService, mw)
	controller.InitCarbonController(app, carbonService, mw)
}

