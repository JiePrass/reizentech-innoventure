// routes/setup.go
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
	authService := service.NewAuthService(
		repository.NewUserRepository(db),
		repository.NewActivityRepository(db),
		repository.CheckMissionRepository(db),
	)

	carbonService := service.NewCarbonService(
		repository.NewCarbonRepository(db),
		repository.CheckMissionRepository(db),
	)

	missionRepo := repository.NewMissionRepository(db)
	userMissionRepo := repository.NewMissionRepository(db)

	userMissionService := service.NewMissionService(
		missionRepo,     // implementasi MissionRepositoryInterface
		userMissionRepo, // implementasi MissionRepositoryInterface
		repository.NewBadgeRepository(db),
	)

	storeRepo := repository.NewStoreRepository(db)
	pointsRepo := repository.NewPointsRepository(db) // Tambahkan ini
	activityRepo := repository.NewActivityRepository(db) // Tambahkan ini
	
	storeService := service.NewStoreService(
		storeRepo,
		pointsRepo,    // Tambahkan points repository
		activityRepo,  // Tambahkan activity repository
	)

	userCustomService := service.NewUserCustomEndpointService(
		repository.NewUserCustomEndpointRepo(db),
	)

	profileService := service.NewUserProfileService(
		repository.NewUserProfileRepository(db),
		repository.NewActivityRepository(db),
	)

	// Initialize controllers
	controller.InitAuthController(app, authService, mw)
	controller.InitCarbonController(app, carbonService, mw)
	controller.InitMissionController(app, userMissionService, mw)
	controller.InitStoreController(app, storeService, mw)
	controller.InitUserProfileController(app, profileService, mw)
	controller.InitUserCustomEndpointController(app, userCustomService, mw)
}