package models

import "time"

type UserMission struct {
	ID          int64      `db:"id"`
	UserID      int64      `db:"user_id"`
	MissionID   int64      `db:"mission_id"`
	Status      string     `db:"status"`
	CompletedAt *time.Time `db:"completed_at"`
	CreatedAt   time.Time  `db:"created_at"`
}
