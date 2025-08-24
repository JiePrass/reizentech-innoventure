// controller/user_profile_controller.go
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

type UserProfileController struct {
	userProfileService service.UserProfileServiceInterface
}

func InitUserProfileController(app *fiber.App, svc service.UserProfileServiceInterface, mw *middleware.Middlewares) {
	ctrl := &UserProfileController{userProfileService: svc}

	private := app.Group("/api/user", mw.JWT)
	private.Get("/profile", ctrl.GetProfile)
	private.Put("/profile", ctrl.UpdateProfile)
}

func (c *UserProfileController) GetProfile(ctx *fiber.Ctx) error {
	claims := helpers.GetUserClaims(ctx)
	if claims == nil {
		return ctx.Status(fiber.StatusUnauthorized).JSON(helpers.BasicResponse(false, "token tidak valid"))
	}

	userID, err := strconv.ParseInt(claims.UserID, 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(helpers.BasicResponse(false, "user ID tidak valid"))
	}

	profile, err := c.userProfileService.GetProfile(ctx.Context(), userID)
	if err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(helpers.BasicResponse(false, err.Error()))
	}

	return ctx.Status(fiber.StatusOK).JSON(helpers.SuccessResponseWithData(true, "profil ditemukan", profile))
}

func (c *UserProfileController) UpdateProfile(ctx *fiber.Ctx) error {
	claims := helpers.GetUserClaims(ctx)
	if claims == nil {
		return ctx.Status(fiber.StatusUnauthorized).JSON(helpers.BasicResponse(false, "token tidak valid"))
	}

	userID, err := strconv.ParseInt(claims.UserID, 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(helpers.BasicResponse(false, "user ID tidak valid"))
	}

	req := new(dto.UserProfileUpdateDTO)
	if err := helpers.BindAndValidate(ctx, req); err != nil {
		if vErr, ok := err.(*helpers.ValidationError); ok {
			return ctx.Status(http.StatusBadRequest).JSON(helpers.ErrorResponseRequest(false, vErr.Message, vErr.Errors))
		}
		return ctx.Status(http.StatusBadRequest).JSON(helpers.BasicResponse(false, err.Error()))
	}

	updatedProfile, err := c.userProfileService.UpdateProfile(ctx.Context(), userID, req)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(helpers.BasicResponse(false, err.Error()))
	}

	return ctx.Status(fiber.StatusOK).JSON(helpers.SuccessResponseWithData(true, "profil berhasil diperbarui", updatedProfile))
}