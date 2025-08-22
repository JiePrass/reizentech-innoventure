package models

import "time"

type PointTransaction struct {
	ID            int64     `db:"id"`
	UserID        int64     `db:"user_id"`
	Amount        int       `db:"amount"`
	Direction     string    `db:"direction"`
	Source        string    `db:"source"`
	ReferenceType *string   `db:"reference_type"`
	ReferenceID   *int64    `db:"reference_id"`
	Note          *string   `db:"note"`
	CreatedAt     time.Time `db:"created_at"`
}
