package models

import "time"

type Coupon struct {
	ID               int64      `db:"id"`
	Code             string     `db:"code"`
	Description      *string    `db:"description"`
	DiscountCents    int        `db:"discount_cents"`
	MinPurchaseCents int        `db:"min_purchase_cents"`
	Status           string     `db:"status"`
	ExpiredAt        *time.Time `db:"expired_at"`
	CreatedAt        time.Time  `db:"created_at"`
}

func (Coupon) TableName() string {
	return "coupons"
}
