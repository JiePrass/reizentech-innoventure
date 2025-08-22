package models

import "time"

type Order struct {
	ID            int64     `db:"id"`
	UserID        int64     `db:"user_id"`
	CouponID      *int64    `db:"coupon_id"`
	TotalCents    int       `db:"total_cents"`
	DiscountCents int       `db:"discount_cents"`
	FinalCents    int       `db:"final_cents"`
	Status        string    `db:"status"`
	CreatedAt     time.Time `db:"created_at"`
}

func (Order) TableName() string {
	return "orders"
}
