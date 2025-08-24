package models

import "time"

	type User struct {
		ID        int64     `db:"id"`
		Username  string    `db:"username"`
		Password  string    `db:"password"`
		Email     string    `db:"email"`
		Role      string    `db:"role"`
		GoogleID  *int64    `db:"google_id"`
		CreatedAt time.Time `db:"created_at"`

		Profile *UserProfile `json:"profile,omitempty"`
	}
