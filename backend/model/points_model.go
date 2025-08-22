package models

import "time"

type Point struct {
	ID          int64     `db:"id"`
	UserID      int64     `db:"user_id"`
	TotalPoints int       `db:"total_points"`
	CreatedAt   time.Time `db:"created_at"`
}
