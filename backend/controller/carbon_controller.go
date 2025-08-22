package controller

import (
	"net/http"
	"strconv"

	dto "github.com/Qodarrz/fiber-app/dto"
	helpers "github.com/Qodarrz/fiber-app/helper"
	"github.com/Qodarrz/fiber-app/middleware"
	service "github.com/Qodarrz/fiber-app/service"
	"github.com/gofiber/fiber/v2"
)

type CarbonController struct {
	carbonService service.CarbonServiceInterface
}

// InitCarbonController inisialisasi route untuk carbon logs
func InitCarbonController(app *fiber.App, svc service.CarbonServiceInterface, mw *middleware.Middlewares) {
	ctrl := &CarbonController{carbonService: svc}

	public := app.Group("/api/carbon", mw.JWT)
	
	// Vehicle routes
	public.Post("/vehicle-log", ctrl.AddVehicleLog)
	
	// Electronics routes
	public.Post("/electronics-log", ctrl.AddElectronicsLog)
}

// ======================== VEHICLE LOG ========================
func (c *CarbonController) AddVehicleLog(ctx *fiber.Ctx) error {
	claims := helpers.GetUserClaims(ctx)
	userID, _ := strconv.ParseInt(claims.UserID, 10, 64)

	dto := new(dto.AddVehicleLogDTO)
	if err := ctx.BodyParser(dto); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(helpers.BasicResponse(false, "invalid body"))
	}

	if err := c.carbonService.AddVehicleLog(ctx.Context(), userID, dto); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(helpers.BasicResponse(false, err.Error()))
	}

	return ctx.Status(fiber.StatusOK).JSON(helpers.BasicResponse(true, "vehicle log berhasil ditambahkan"))
}


// ======================== ELECTRONICS LOG ========================
func (c *CarbonController) AddElectronicsLog(ctx *fiber.Ctx) error {
	claims := helpers.GetUserClaims(ctx)
	userID, _ := strconv.ParseInt(claims.UserID, 10, 64)

	dto := new(dto.AddElectronicsLogDTO)
	if err := ctx.BodyParser(dto); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(helpers.BasicResponse(false, "invalid body"))
	}

	if err := c.carbonService.AddElectronicsLog(ctx.Context(), userID, dto); err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(helpers.BasicResponse(false, err.Error()))
	}

	return ctx.Status(http.StatusOK).JSON(helpers.SuccessResponseWithData(true, "electronics log berhasil ditambahkan", nil))
}
