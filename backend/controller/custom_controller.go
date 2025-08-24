package controller

import (
	"net/http"
	"strconv"

	"github.com/Qodarrz/fiber-app/dto"
	helper "github.com/Qodarrz/fiber-app/helper"
	"github.com/Qodarrz/fiber-app/middleware"
	"github.com/Qodarrz/fiber-app/service"
	"github.com/gofiber/fiber/v2"
)

type UserCustomEndpointController struct {
	userCustomService service.UserCustomEndpointServiceInterface
}

func InitUserCustomEndpointController(app *fiber.App, svc service.UserCustomEndpointServiceInterface, mw *middleware.Middlewares) {
	ctrl := &UserCustomEndpointController{userCustomService: svc}

	// Public routes
	public := app.Group("/api/custom")
	public.Get("/leaderboard", ctrl.GetLeaderboard)

	// Private routes (require authentication)
	private := app.Group("/api/custom", mw.JWT)
	private.Get("/user-data/:id", ctrl.GetUserCustomData)
	private.Get("/my-data", ctrl.GetMyCustomData)
}

func (c *UserCustomEndpointController) GetUserCustomData(ctx *fiber.Ctx) error {
	userID, err := strconv.ParseInt(ctx.Params("id"), 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(helper.BasicResponse(false, "Invalid user ID"))
	}

	// Check if user is accessing their own data or has admin privileges
	claims := helper.GetUserClaims(ctx)
	if claims == nil {
		return ctx.Status(http.StatusUnauthorized).JSON(helper.BasicResponse(false, "Unauthorized"))
	}

	currentUserID, _ := strconv.ParseInt(claims.UserID, 10, 64)
	if currentUserID != userID  {
		return ctx.Status(http.StatusForbidden).JSON(helper.BasicResponse(false, "Access denied"))
	}

	data, err := c.userCustomService.GetUserCustomData(ctx.Context(), userID)
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(helper.BasicResponse(false, err.Error()))
	}

	return ctx.Status(http.StatusOK).JSON(helper.SuccessResponseWithData(true, "User data retrieved successfully", data))
}

func (c *UserCustomEndpointController) GetMyCustomData(ctx *fiber.Ctx) error {
	claims := helper.GetUserClaims(ctx)
	if claims == nil {
		return ctx.Status(http.StatusUnauthorized).JSON(helper.BasicResponse(false, "Unauthorized"))
	}

	userID, err := strconv.ParseInt(claims.UserID, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(helper.BasicResponse(false, "Invalid user ID"))
	}

	data, err := c.userCustomService.GetUserCustomData(ctx.Context(), userID)
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(helper.BasicResponse(false, err.Error()))
	}

	return ctx.Status(http.StatusOK).JSON(helper.SuccessResponseWithData(true, "User data retrieved successfully", data))
}

func (c *UserCustomEndpointController) GetLeaderboard(ctx *fiber.Ctx) error {
	req := new(dto.LeaderboardRequestDTO)
	if err := helper.BindAndValidate(ctx, req); err != nil {
		if vErr, ok := err.(*helper.ValidationError); ok {
			return ctx.Status(http.StatusBadRequest).JSON(helper.ErrorResponseRequest(false, vErr.Message, vErr.Errors))
		}
		return ctx.Status(http.StatusBadRequest).JSON(helper.BasicResponse(false, err.Error()))
	}

	leaderboard, err := c.userCustomService.GetLeaderboard(ctx.Context(), req)
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(helper.BasicResponse(false, err.Error()))
	}

	return ctx.Status(http.StatusOK).JSON(helper.SuccessResponseWithData(true, "Leaderboard retrieved successfully", leaderboard))
}