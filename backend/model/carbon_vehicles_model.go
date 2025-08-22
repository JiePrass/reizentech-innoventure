package models

import "time"

type CarbonVehicle struct {
	ID         int64     `json:"id"`
	UserID     int64     `json:"user_id"`
	VehicleType string   `json:"vehicle_type"`
	FuelType   string   `json:"fuel_type"`
	Name       string   `json:"name"`
	CreatedAt  time.Time `json:"created_at"`
}