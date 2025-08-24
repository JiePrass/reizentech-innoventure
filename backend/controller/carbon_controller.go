// controller/carbon_controller.go
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

func InitCarbonController(app *fiber.App, svc service.CarbonServiceInterface, mw *middleware.Middlewares) {
	ctrl := &CarbonController{carbonService: svc}

	public := app.Group("/api/carbon", mw.JWT)
	
	public.Post("/vehicle", ctrl.CreateVehicle)
	public.Get("/vehicles", ctrl.ListUserVehicles)
	public.Post("/vehicle-log", ctrl.AddVehicleLog)
	public.Get("/vehicle/:id/logs", ctrl.GetVehicleLogs)

	public.Post("/electronic", ctrl.CreateElectronic)
	public.Get("/electronics", ctrl.ListUserElectronics)
	public.Post("/electronics-log", ctrl.AddElectronicsLog)
	public.Get("/electronic/:id/logs", ctrl.GetElectronicsLogs)
	
}

func (c *CarbonController) CreateVehicle(ctx *fiber.Ctx) error {
	claims := helpers.GetUserClaims(ctx)
	userID, _ := strconv.ParseInt(claims.UserID, 10, 64)

	dto := new(dto.CreateVehicleDTO)
	if err := ctx.BodyParser(dto); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(helpers.BasicResponse(false, "invalid body"))
	}

	vehicle, err := c.carbonService.CreateVehicle(ctx.Context(), userID, dto)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(helpers.BasicResponse(false, err.Error()))
	}

	return ctx.Status(fiber.StatusCreated).JSON(helpers.SuccessResponseWithData(true, "vehicle created successfully", vehicle))
}

func (c *CarbonController) ListUserVehicles(ctx *fiber.Ctx) error {
	claims := helpers.GetUserClaims(ctx)
	userID, _ := strconv.ParseInt(claims.UserID, 10, 64)

	vehicles, err := c.carbonService.ListUserVehicles(ctx.Context(), userID)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(helpers.BasicResponse(false, err.Error()))
	}

	return ctx.Status(fiber.StatusOK).JSON(helpers.SuccessResponseWithData(true, "vehicles retrieved successfully", vehicles))
}

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

func (c *CarbonController) GetVehicleLogs(ctx *fiber.Ctx) error {
	claims := helpers.GetUserClaims(ctx)
	userID, _ := strconv.ParseInt(claims.UserID, 10, 64)

	vehicleID, err := strconv.ParseInt(ctx.Params("id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(helpers.BasicResponse(false, "invalid vehicle ID"))
	}

	logs, err := c.carbonService.GetVehicleLogs(ctx.Context(), userID, vehicleID)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(helpers.BasicResponse(false, err.Error()))
	}

	return ctx.Status(fiber.StatusOK).JSON(helpers.SuccessResponseWithData(true, "vehicle logs retrieved successfully", logs))
}

func (c *CarbonController) CreateElectronic(ctx *fiber.Ctx) error {
	claims := helpers.GetUserClaims(ctx)
	userID, _ := strconv.ParseInt(claims.UserID, 10, 64)

	dto := new(dto.CreateElectronicDTO)
	if err := ctx.BodyParser(dto); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(helpers.BasicResponse(false, "invalid body"))
	}

	electronic, err := c.carbonService.CreateElectronic(ctx.Context(), userID, dto)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(helpers.BasicResponse(false, err.Error()))
	}

	return ctx.Status(fiber.StatusCreated).JSON(helpers.SuccessResponseWithData(true, "electronic device created successfully", electronic))
}

func (c *CarbonController) ListUserElectronics(ctx *fiber.Ctx) error {
	claims := helpers.GetUserClaims(ctx)
	userID, _ := strconv.ParseInt(claims.UserID, 10, 64)

	electronics, err := c.carbonService.ListUserElectronics(ctx.Context(), userID)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(helpers.BasicResponse(false, err.Error()))
	}

	return ctx.Status(fiber.StatusOK).JSON(helpers.SuccessResponseWithData(true, "electronic devices retrieved successfully", electronics))
}

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

	return ctx.Status(http.StatusOK).JSON(helpers.BasicResponse(true, "electronics log berhasil ditambahkan"))
}

func (c *CarbonController) GetElectronicsLogs(ctx *fiber.Ctx) error {
	claims := helpers.GetUserClaims(ctx)
	userID, _ := strconv.ParseInt(claims.UserID, 10, 64)

	deviceID, err := strconv.ParseInt(ctx.Params("id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(helpers.BasicResponse(false, "invalid device ID"))
	}

	logs, err := c.carbonService.GetElectronicsLogs(ctx.Context(), userID, deviceID)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(helpers.BasicResponse(false, err.Error()))
	}

	return ctx.Status(fiber.StatusOK).JSON(helpers.SuccessResponseWithData(true, "electronics logs retrieved successfully", logs))
}

// Electronics methods remain similar but would follow the same pattern