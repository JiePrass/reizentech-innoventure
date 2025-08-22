package models

import "time"

type StoreItem struct {
	ID          int64     `db:"id"`
	Name        string    `db:"name"`
	Description *string   `db:"description"`
	PriceCents  int       `db:"price_cents"`
	Stock       *int      `db:"stock"`
	Status      string    `db:"status"`
	ImageURL    *string   `db:"image_url"`
	CreatedAt   time.Time `db:"created_at"`
}

func (StoreItem) TableName() string {
	return "store_items"
}
