package repository

import (
	"context"
	"database/sql"
	"errors"
	"time"

	model "github.com/Qodarrz/fiber-app/model"
)

type UserRepositoryInterface interface {
	FindByEmail(ctx context.Context, email string) (*model.User, error)
	FindByID(ctx context.Context, id int64) (*model.User, *model.UserProfile, error)
	Create(ctx context.Context, user *model.User, profile *model.UserProfile) error
	Update(ctx context.Context, user *model.User) error
	VerifyEmailByToken(ctx context.Context, token int64) error
	SaveResetPasswordToken(ctx context.Context, userID int64, token string) error
	FindByResetPasswordToken(ctx context.Context, token string) (*model.User, error)
}

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepositoryInterface {
	return &userRepository{db: db}
}

func (r *userRepository) FindByEmail(ctx context.Context, email string) (*model.User, error) {
	user := &model.User{}
	query := `SELECT id, username, email, password, role, created_at
	          FROM users WHERE email = $1 LIMIT 1`
	err := r.db.QueryRowContext(ctx, query, email).Scan(
		&user.ID, &user.Username, &user.Email, &user.Password,
		&user.Role, &user.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return user, nil
}

func (r *userRepository) FindByID(ctx context.Context, id int64) (*model.User, *model.UserProfile, error) {
	user := &model.User{}
	profile := &model.UserProfile{}

	query := `
		SELECT u.id, u.username, u.email, u.password, u.role, u.created_at,
		       p.id, p.user_id, p.full_name, p.avatar_url, p.birthdate, p.gender, p.created_at
		FROM users u
		LEFT JOIN user_profiles p ON u.id = p.user_id
		WHERE u.id = $1
	`

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		// users
		&user.ID, &user.Username, &user.Email, &user.Password,
		&user.Role, &user.CreatedAt,
		// user_profiles
		&profile.ID, &profile.UserID, &profile.FullName,
		&profile.AvatarURL, &profile.Birthdate, &profile.Gender,
		&profile.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil, err
		}
		return nil, nil, err
	}

	// assign profile ke user
	user.Profile = profile

	return user, profile, nil
}

func (r *userRepository) Create(ctx context.Context, user *model.User, profile *model.UserProfile) error {
	// Mulai transaction
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	// Step 1: Insert ke tabel users
	userQuery := `
		INSERT INTO users (username, email, password, role, google_id, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id
	`
	err = tx.QueryRowContext(ctx, userQuery,
		user.Username, user.Email, user.Password, user.Role, user.GoogleID, user.CreatedAt,
	).Scan(&user.ID)
	if err != nil {
		tx.Rollback()
		return err
	}

	// Step 2: Insert ke tabel user_profiles hanya dengan user_id
	profileQuery := `
		INSERT INTO user_profiles (user_id, created_at)
		VALUES ($1, $2)
		RETURNING id
	`
	err = tx.QueryRowContext(ctx, profileQuery,
		user.ID, time.Now(),
	).Scan(&profile.ID)
	if err != nil {
		tx.Rollback()
		return err
	}

	// Commit transaction
	return tx.Commit()
}

func (r *userRepository) Update(ctx context.Context, user *model.User) error {
	query := `UPDATE users SET username = $1, email = $2, password = $3, role = $4 WHERE id = $5`
	_, err := r.db.ExecContext(ctx, query, user.Username, user.Email, user.Password, user.Role, user.ID)
	return err
}

func (r *userRepository) VerifyEmailByToken(ctx context.Context, userID int64) error {
	query := `UPDATE users SET email_verified_at = $1 WHERE id = $2`
	_, err := r.db.ExecContext(ctx, query, time.Now(), userID)
	return err
}

func (r *userRepository) SaveResetPasswordToken(ctx context.Context, userID int64, token string) error {
	query := `INSERT INTO reset_password_token (user_id, token) VALUES ($1, $2)`
	_, err := r.db.ExecContext(ctx, query, userID, token)
	return err
}

func (r *userRepository) FindByResetPasswordToken(ctx context.Context, token string) (*model.User, error) {
	query := `SELECT u.id, u.username, u.email, u.password, u.role, u.created_at
			  FROM users u
			  JOIN reset_password_token r ON u.id = r.user_id
			  WHERE r.token = $1`
	user := &model.User{}
	err := r.db.QueryRowContext(ctx, query, token).Scan(
		&user.ID, &user.Username, &user.Email, &user.Password,
		&user.Role, &user.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return user, nil
}
