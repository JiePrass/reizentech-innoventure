// dto/electronics.go
package dto

type CreateElectronicDTO struct {
	DeviceName string `json:"device_name" validate:"required"`
	DeviceType string `json:"device_type" validate:"required"`
	PowerWatts int    `json:"power_watts" validate:"required,gt=0"`
}

type AddElectronicsLogDTO struct {
	DeviceID      *int64  `json:"device_id,omitempty"`      // Optional jika membuat device baru
	DeviceName    string  `json:"device_name,omitempty"`    // Required jika DeviceID tidak provided
	DeviceType    string  `json:"device_type,omitempty"`    // Required jika DeviceID tidak providedx
	PowerWatts    int     `json:"power_watts,omitempty"`    // Required jika DeviceID tidak provided
	DurationHours float64 `json:"duration_hours" validate:"required,gt=0"`
}