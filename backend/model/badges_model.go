package models

import "time"

type Badge struct {
	ID             int64     `db:"id"`
	Name           string    `db:"name"`
	Description    *string   `db:"description"`
	RequiredPoints int       `db:"required_points"`
	CreatedAt      time.Time `db:"created_at"`
}
