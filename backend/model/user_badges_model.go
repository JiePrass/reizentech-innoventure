package models

import "time"

type UserBadge struct {
	ID         int64      `db:"id"`
	UserID     int64      `db:"user_id"`
	BadgeID    int64      `db:"badge_id"`
	RedeemedAt *time.Time `db:"redeemed_at"`
	CreatedAt  time.Time  `db:"created_at"`
}
