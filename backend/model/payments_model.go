package models

import "time"

type Payment struct {
	ID            int64      `db:"id"`
	OrderID       int64      `db:"order_id"`
	Provider      string     `db:"provider"`
	Method        *string    `db:"method"`
	AmountCents   int        `db:"amount_cents"`
	Currency      string     `db:"currency"`
	Status        string     `db:"status"`
	ReferenceCode *string    `db:"reference_code"`
	PaidAt        *time.Time `db:"paid_at"`
	CreatedAt     time.Time  `db:"created_at"`
}

func (Payment) TableName() string {
	return "payments"
}
