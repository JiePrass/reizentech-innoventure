package models

import (
	"time"
)

// Enum mission_type
type MissionType string

const (
	CarbonReduction MissionType = "carbon_reduction"
	Streak          MissionType = "streak"
	Activity        MissionType = "activity"
	Custom          MissionType = "custom"
)

type Mission struct {
	ID              int64       `db:"id" json:"id"`
	Title           string      `db:"title" json:"title"`
	Description     *string     `db:"description" json:"description,omitempty"`
	MissionType     MissionType `db:"mission_type" json:"mission_type"`
	PointsReward    int         `db:"points_reward" json:"points_reward"`
	GivesBadge      bool        `db:"gives_badge" json:"gives_badge"`
	BadgeID         *int64      `db:"badge_id" json:"badge_id,omitempty"`
	CarbonReduction *float64    `db:"carbon_reduction_g" json:"carbon_reduction_g,omitempty"`
	Criteria        []byte      `db:"criteria" json:"criteria,omitempty"` // JSONB, bisa di-unmarshal
	CreatedAt       time.Time   `db:"created_at" json:"created_at"`
	ExpiredAt       *time.Time  `db:"expired_at" json:"expired_at,omitempty"`
}
