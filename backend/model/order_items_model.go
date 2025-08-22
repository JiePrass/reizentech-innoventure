package models

import "time"

type OrderItem struct {
	ID             int64     `db:"id"`
	OrderID        int64     `db:"order_id"`
	ItemID         int64     `db:"item_id"`
	Qty            int       `db:"qty"`
	PriceEachCents int       `db:"price_each_cents"`
	CreatedAt      time.Time `db:"created_at"`
}

func (OrderItem) TableName() string {
	return "order_items"
}
