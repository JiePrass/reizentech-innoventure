package models

import "time"	

type Badge struct {
	ID             int64     `json:"id"`
	Name           string    `json:"name"`
	ImageURL       string    `json:"image_url"`
	Description    string    `json:"description"`
	RequiredPoints int       `json:"required_points"`
	CreatedAt      time.Time `json:"created_at"`
}

