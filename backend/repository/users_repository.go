// repository/user_profile_repository.go
package repository

import (
	"context"
	"database/sql"
	"errors"
	"time"

	model "github.com/Qodarrz/fiber-app/model"
)

type UserProfileRepositoryInterface interface {
	FindByUserID(ctx context.Context, userID int64) (*model.UserProfile, error)
	FindByUID(ctx context.Context, userID int64) (*model.User, *model.UserProfile, error)
	Update(ctx context.Context, profile *model.UserProfile) error
	Create(ctx context.Context, profile *model.UserProfile) error
}

type userProfileRepository struct {
	db *sql.DB
}

func NewUserProfileRepository(db *sql.DB) UserProfileRepositoryInterface {
	return &userProfileRepository{db: db}
}

func (r *userProfileRepository) FindByUserID(ctx context.Context, userID int64) (*model.UserProfile, error) {
	profile := &model.UserProfile{}
	query := `
		SELECT id, user_id, full_name, avatar_url, birthdate, gender, created_at
		FROM user_profiles 
		WHERE user_id = $1
	`
	
	err := r.db.QueryRowContext(ctx, query, userID).Scan(
		&profile.ID,
		&profile.UserID,
		&profile.FullName,
		&profile.AvatarURL,
		&profile.Birthdate,
		&profile.Gender,
		&profile.CreatedAt,
	)
	
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	
	return profile, nil
}

func (r *userProfileRepository) Update(ctx context.Context, profile *model.UserProfile) error {
	query := `
		UPDATE user_profiles 
		SET full_name = $1, avatar_url = $2, birthdate = $3, gender = $4 
		WHERE user_id = $5
	`
	
	_, err := r.db.ExecContext(ctx, query,
		profile.FullName,
		profile.AvatarURL,
		profile.Birthdate,
		profile.Gender,
		profile.UserID,
	)
	
	return err
}

func (r *userProfileRepository) Create(ctx context.Context, profile *model.UserProfile) error {
	query := `
		INSERT INTO user_profiles (user_id, full_name, avatar_url, birthdate, gender, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id
	`
	
	return r.db.QueryRowContext(ctx, query,
		profile.UserID,
		profile.FullName,
		profile.AvatarURL,
		profile.Birthdate,
		profile.Gender,
		time.Now(),
	).Scan(&profile.ID)
}

func (r *userProfileRepository) FindByUID(ctx context.Context, userID int64) (*model.User, *model.UserProfile, error) {
    user := &model.User{}

    // pakai NullXXX untuk handle kolom yang bisa NULL
    var (
        profileID   sql.NullInt64
        profileUID  sql.NullInt64
        fullName    sql.NullString
        avatarURL   sql.NullString
        birthdate   sql.NullTime
        gender      sql.NullString
        createdAt   sql.NullTime
    )

    query := `
        SELECT u.id, u.username, u.email, u.role,
               p.id, p.user_id, p.full_name, p.avatar_url, p.birthdate, p.gender, p.created_at
        FROM users u
        LEFT JOIN user_profiles p ON u.id = p.user_id
        WHERE u.id = $1
    `
    err := r.db.QueryRowContext(ctx, query, userID).Scan(
        &user.ID, &user.Username, &user.Email, &user.Role,
        &profileID, &profileUID, &fullName, &avatarURL,
        &birthdate, &gender, &createdAt,
    )
    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            return nil, nil, nil
        }
        return nil, nil, err
    }

    // kalau profile NULL, kembalikan nil supaya service bisa bikin baru
    if !profileID.Valid {
        return user, nil, nil
    }

    profile := &model.UserProfile{
        ID:        profileID.Int64,
        UserID:    profileUID.Int64,
        FullName:  fullName.String,
        AvatarURL: avatarURL.String,
        Birthdate: birthdate.Time,
        Gender:    gender.String,
        CreatedAt: createdAt.Time,
    }

    return user, profile, nil
}
