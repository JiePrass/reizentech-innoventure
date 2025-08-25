// service/user_profile_service.go
package service

import (
	"context"
	"errors"

	dto "github.com/Qodarrz/fiber-app/dto"
	models "github.com/Qodarrz/fiber-app/model"
	"github.com/Qodarrz/fiber-app/repository"
)

type UserProfileServiceInterface interface {
	GetProfile(ctx context.Context, userID int64) (*dto.UserWithProfileResponseDTO, error)
	UpdateProfile(ctx context.Context, userID int64, req *dto.UserProfileUpdateDTO) (*dto.UserWithProfileResponseDTO, error)
}

type UserProfileService struct {
	userRepo         repository.UserRepositoryInterface
	userProfileRepo  repository.UserProfileRepositoryInterface
	activityRepo     repository.ActivityRepositoryInterface
}

func NewUserProfileService(
	userProfileRepo repository.UserProfileRepositoryInterface,
	activityRepo repository.ActivityRepositoryInterface,
) *UserProfileService {
	return &UserProfileService{
		userProfileRepo: userProfileRepo,
		activityRepo:    activityRepo,
	}
}

func (s *UserProfileService) GetProfile(ctx context.Context, userID int64) (*dto.UserWithProfileResponseDTO, error) {
	user, profile, err := s.userProfileRepo.FindByUID(ctx, userID)
	if err != nil {
		return nil, errors.New("user tidak ditemukan")
	}

	// Jika profile belum ada, buat profile kosong
	if profile == nil {
		profile = &models.UserProfile{
			UserID: userID,
		}
		if err := s.userProfileRepo.Create(ctx, profile); err != nil {
			return nil, errors.New("gagal membuat profile")
		}
	}

	response := &dto.UserWithProfileResponseDTO{
		ID:       user.ID,
		Username: user.Username,
		Email:    user.Email,
		Role:     user.Role,
		Profile: dto.UserProfileResponseDTO{
			ID:        profile.ID,
			UserID:    profile.UserID,
			FullName:  *profile.FullName,
			AvatarURL: *profile.AvatarURL,
			Birthdate: *profile.Birthdate,
			Gender:    *profile.Gender,
			CreatedAt: profile.CreatedAt,
		},
	}

	return response, nil
}

func (s *UserProfileService) UpdateProfile(ctx context.Context, userID int64, req *dto.UserProfileUpdateDTO) (*dto.UserWithProfileResponseDTO, error) {
	// Cek apakah user exists
	user, _, err := s.userProfileRepo.FindByUID(ctx, userID)
	if err != nil || user == nil {
		return nil, errors.New("user tidak ditemukan")
	}

	// Get existing profile atau buat baru jika belum ada
	profile, err := s.userProfileRepo.FindByUserID(ctx, userID)
	if err != nil {
		return nil, errors.New("gagal mengambil data profile")
	}

	if profile == nil {
		// Buat profile baru jika belum ada
		profile = &models.UserProfile{
			UserID: userID,
		}
		if err := s.userProfileRepo.Create(ctx, profile); err != nil {
			return nil, errors.New("gagal membuat profile")
		}
	}

	// Update fields yang di-provide
	if req.FullName != nil {
		profile.FullName = req.FullName
	}
	if req.AvatarURL != nil {
		profile.AvatarURL = req.AvatarURL
	}
	if req.Birthdate != nil {
		profile.Birthdate = req.Birthdate
	}

	if req.Gender != nil {
		profile.Gender = req.Gender
	}

	// Update profile
	if err := s.userProfileRepo.Update(ctx, profile); err != nil {
		return nil, errors.New("gagal mengupdate profile")
	}

	// Log activity
	activityMsg := "User update profile"
	if err := s.activityRepo.LogActivity(ctx, userID, activityMsg); err != nil {
		// Tidak return error, hanya log
	}

	// Return updated profile
	response := &dto.UserWithProfileResponseDTO{
		ID:       user.ID,
		Username: user.Username,
		Email:    user.Email,
		Role:     user.Role,
		Profile: dto.UserProfileResponseDTO{
			ID:        profile.ID,
			UserID:    profile.UserID,
			FullName:  *profile.FullName,
			AvatarURL: *profile.AvatarURL,
			Birthdate: *profile.Birthdate,
			Gender:    *profile.Gender,
			CreatedAt: profile.CreatedAt,
		},
	}

	return response, nil
}