package models

import "time"

type CarbonVehicleLog struct {
	ID              int64     `db:"id"`
	VehicleID       int64     `db:"vehicle_id"`
	StartLocation   string   `db:"start_location"`
	EndLocation     string   `db:"end_location"`
	DistanceKm      float64   `db:"distance_km"`
	DurationMinutes int      `db:"duration_minutes"`
	CarbonEmission  float64   `db:"carbon_emission_g"`
	LoggedAt        time.Time `db:"logged_at"`
}

func (CarbonVehicleLog) TableName() string {
	return "carbon_vehicle_logs"
}
