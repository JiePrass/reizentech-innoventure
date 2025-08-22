package dto

// ======================== Vehicles ========================
type CreateCarbonVehicleDTO struct {
	VehicleType string `json:"vehicle_type" binding:"required,oneof=car motorcycle bicycle public_transport walk"`
	FuelType    string `json:"fuel_type" binding:"required,oneof=petrol diesel electric none"`
	Name        string `json:"name,omitempty"`
}

type AddVehicleLogDTO struct {
	VehicleID      *int64  `json:"vehicle_id,omitempty"`
	VehicleName    string  `json:"name,omitempty"`
	VehicleType    string  `json:"vehicle_type,omitempty"`
	FuelType       string  `json:"fuel_type,omitempty"`
	StartLocation  string  `json:"start_location" binding:"required"`
	EndLocation    string  `json:"end_location" binding:"required"`
	DistanceKm     float64 `json:"distance_km" binding:"required,gt=0"`
	DurationMinutes int    `json:"duration_minutes,omitempty"`
}

type CreateCarbonElectronicDTO struct {
	DeviceName string `json:"device_name" binding:"required"`
	DeviceType string `json:"device_type" binding:"required"`
	PowerWatts int    `json:"power_watts" binding:"required,min=1"`
}

type AddElectronicsLogDTO struct {
	DeviceID      *int64  `json:"device_id,omitempty"`
	DeviceName    string  `json:"device_name,omitempty"`
	DeviceType    string  `json:"device_type,omitempty"`
	PowerWatts    int     `json:"power_watts,omitempty"`
	DurationHours float64 `json:"duration_hours" binding:"required,gt=0"`
}
