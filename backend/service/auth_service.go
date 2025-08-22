package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	dto "github.com/Qodarrz/fiber-app/dto"
	helpers "github.com/Qodarrz/fiber-app/helper"
	models "github.com/Qodarrz/fiber-app/model"
	"github.com/Qodarrz/fiber-app/repository"
	"golang.org/x/crypto/bcrypt"
)

// Interface
type AuthServiceInterface interface {
	Register(ctx context.Context, req *dto.RegisterDTO) (*models.User, error)
	Login(ctx context.Context, req *dto.LoginDTO) (*models.User, string, error)
	GetProfile(ctx context.Context, userID int64) (*models.User, error)
	VerifyEmail(ctx context.Context, userID int64) error
	RequestResetPassword(ctx context.Context, email string) error
	ResetPassword(ctx context.Context, token, newPassword string) error
	UpdatePassword(ctx context.Context, userID int64, oldPassword, newPassword string) error
}

// Implementasi
type AuthService struct {
	userRepo     repository.UserRepositoryInterface
	activityRepo repository.ActivityRepositoryInterface
}

// Constructor
func NewAuthService(repo repository.UserRepositoryInterface, activityRepo repository.ActivityRepositoryInterface) *AuthService {
	return &AuthService{userRepo: repo, activityRepo: activityRepo}
}

// Hash password
func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// Check password
func checkPassword(hashedPassword, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}

// Register
func (s *AuthService) Register(ctx context.Context, req *dto.RegisterDTO) (*models.User, error) {
	// Cek email sudah ada
	exists, _ := s.userRepo.FindByEmail(ctx, req.Email)
	if exists != nil {
		return nil, errors.New("email sudah terdaftar")
	}

	// Hash password
	hashedPass, err := hashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	// Buat object User
	user := &models.User{
		Username:  req.Username,
		Email:     req.Email,
		Password:  hashedPass,
		Role:      "user",
		CreatedAt: time.Now(),
	}

	if req.Role != nil {
		user.Role = *req.Role
	}
	if req.GoogleID != nil {
		user.GoogleID = req.GoogleID
	}

	// Profile default (cuma user_id + created_at nanti diisi di repo)
	profile := &models.UserProfile{
		CreatedAt: time.Now(),
	}

	// Insert user + profile sekaligus dalam satu transaction
	if err := s.userRepo.Create(ctx, user, profile); err != nil {
		return nil, err
	}

	// Buat token verifikasi email
	token, err := helpers.GenerateEmailVerificationToken(fmt.Sprint(user.ID), user.Email)
	if err != nil {
		return nil, err
	}

	// Kirim email verifikasi langsung
	if err := helpers.SendEmailVerification(user.Email, token); err != nil {
		return nil, err
	}

	return user, nil
}

// Login
// Login
func (s *AuthService) Login(ctx context.Context, req *dto.LoginDTO) (*models.User, string, error) {
	user, err := s.userRepo.FindByEmail(ctx, req.Email)
	if err != nil || user == nil {
		return nil, "", errors.New("email atau password salah")
	}

	if !checkPassword(user.Password, req.Password) {
		return nil, "", errors.New("email atau password salah")
	}

	token, err := helpers.GenerateJWT(fmt.Sprint(user.ID))
	if err != nil {
		return nil, "", err
	}

	// Simpan activity log (tapi jangan hentikan login kalau gagal nulis log)
	msg := fmt.Sprintf("User %d login berhasil", user.ID)
	if err := s.activityRepo.LogActivity(ctx, user.ID, msg); err != nil {
		// Bisa pilih: log error aja, tapi jangan gagal login
		fmt.Printf("gagal simpan activity log: %v\n", err)
	}

	return user, token, nil
}

// Get profile
func (s *AuthService) GetProfile(ctx context.Context, userID int64) (*models.User, error) {
	user, _, err := s.userRepo.FindByID(ctx, userID) // tangkap 3 return values, tapi profile di-ignore
	if err != nil {
		return nil, errors.New("user tidak ditemukan")
	}
	return user, nil
}

// Verify email
func (s *AuthService) VerifyEmail(ctx context.Context, userID int64) error {
	return s.userRepo.VerifyEmailByToken(ctx, userID)
}

// Request reset password
func (s *AuthService) RequestResetPassword(ctx context.Context, email string) error {
	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil || user == nil {
		return errors.New("email tidak ditemukan")
	}

	token := helpers.GenerateRandomToken(7)
	err = s.userRepo.SaveResetPasswordToken(ctx, user.ID, token)
	if err != nil {
		return fmt.Errorf("gagal menyimpan token reset password: %w", err)
	}

	return helpers.SendTokenForgotEmail(email, token) // pakai helper email
}

// Reset password
func (s *AuthService) ResetPassword(ctx context.Context, token, newPassword string) error {
	user, err := s.userRepo.FindByResetPasswordToken(ctx, token)
	if err != nil || user == nil {
		return errors.New("token tidak valid atau sudah kadaluarsa")
	}

	hashedPass, err := hashPassword(newPassword)
	if err != nil {
		return err
	}
	user.Password = hashedPass
	return s.userRepo.Update(ctx, user)
}

// Update password
func (s *AuthService) UpdatePassword(ctx context.Context, userID int64, oldPassword, newPassword string) error {
	user, _, err := s.userRepo.FindByID(ctx, userID)
	if err != nil || user == nil {
		return errors.New("user tidak ditemukan")
	}

	if !checkPassword(user.Password, oldPassword) {
		return errors.New("password lama salah")
	}

	hashedPass, err := hashPassword(newPassword)
	if err != nil {
		return err
	}
	user.Password = hashedPass
	return s.userRepo.Update(ctx, user)
}
