// dto/vehicle.go
package dto

type CreateVehicleDTO struct {
	VehicleType string  `json:"vehicle_type" validate:"required"`
	FuelType    string  `json:"fuel_type" validate:"required"`
	Name        string  `json:"name" validate:"required"`
}

type AddVehicleLogDTO struct {
	VehicleID       *int64   `json:"vehicle_id,omitempty"` // Optional if creating new vehicle
	VehicleType     string   `json:"vehicle_type,omitempty"` // Required if VehicleID is not provided
	FuelType        string   `json:"fuel_type,omitempty"`    // Required if VehicleID is not provided
	VehicleName     string   `json:"vehicle_name,omitempty"` // Required if VehicleID is not provided
	StartLocation   string   `json:"start_location" validate:"required"`
	EndLocation     string   `json:"end_location" validate:"required"`
	DistanceKm      float64  `json:"distance_km" validate:"required,gt=0"`
	DurationMinutes int      `json:"duration_minutes" validate:"required,gt=0"`
}

type EditVehicleDTO struct {
	VehicleType string `json:"vehicle_type"`
	FuelType    string `json:"fuel_type"`
	Name        string `json:"name"`
}