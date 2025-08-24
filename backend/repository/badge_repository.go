// repository/badge.go
package repository

import (
	"context"
	"database/sql"
	"errors"

	model "github.com/Qodarrz/fiber-app/model"
)

type BadgeRepositoryInterface interface {
	FindByID(ctx context.Context, id int64) (*model.Badge, error)
	FindAll(ctx context.Context, page, limit int) ([]*model.Badge, error)
	Create(ctx context.Context, badge *model.Badge) error
}

type badgeRepository struct {
	db *sql.DB
}

func NewBadgeRepository(db *sql.DB) BadgeRepositoryInterface {
	return &badgeRepository{db: db}
}

func (r *badgeRepository) FindByID(ctx context.Context, id int64) (*model.Badge, error) {
	query := `
		SELECT id, name, image_url, description, created_at
		FROM badges
		WHERE id = $1
	`
	
	badge := &model.Badge{}
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&badge.ID, &badge.Name, &badge.ImageURL, &badge.Description,
		&badge.CreatedAt,
	)
	
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	
	return badge, nil
}

func (r *badgeRepository) FindAll(ctx context.Context, page, limit int) ([]*model.Badge, error) {
	offset := (page - 1) * limit
	query := `
		SELECT id, name, image_url, description, created_at
		FROM badges
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`
	
	rows, err := r.db.QueryContext(ctx, query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var badges []*model.Badge
	for rows.Next() {
		badge := &model.Badge{}
		err := rows.Scan(
			&badge.ID, &badge.Name, &badge.ImageURL, &badge.Description,
			&badge.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		badges = append(badges, badge)
	}
	
	return badges, nil
}



func (r *badgeRepository) Create(ctx context.Context, badge *model.Badge) error {
	query := `
		INSERT INTO badges (name, image_url, description, created_at)
		VALUES ($1, $2, $3, $4)
		RETURNING id
	`
	
	err := r.db.QueryRowContext(ctx, query,
		badge.Name, badge.ImageURL, badge.Description, badge.CreatedAt,
	).Scan(&badge.ID)
	
	return err
}