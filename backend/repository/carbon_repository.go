// repository/carbon_repository.go
package repository

import (
	"context"
	"database/sql"

	models "github.com/Qodarrz/fiber-app/model"
)

type CarbonRepository interface {
	// Vehicle
	FindVehicleByID(ctx context.Context, id int64) (*models.CarbonVehicle, error)
	FindVehicleByUserAndName(ctx context.Context, userID int64, name string) (*models.CarbonVehicle, error)
	CreateVehicle(ctx context.Context, v *models.CarbonVehicle) (*models.CarbonVehicle, error)
	ListUserVehicles(ctx context.Context, userID int64) ([]*models.CarbonVehicle, error)
	CreateVehicleLog(ctx context.Context, log *models.CarbonVehicleLog) error
	GetVehicleLogs(ctx context.Context, vehicleID int64) ([]*models.CarbonVehicleLog, error)
	
	FindElectronicsByID(ctx context.Context, id int64) (*models.CarbonElectronic, error)
	FindElectronicsByUserAndName(ctx context.Context, userID int64, deviceName string) (*models.CarbonElectronic, error)
	CreateElectronics(ctx context.Context, e *models.CarbonElectronic) (*models.CarbonElectronic, error)
	ListUserElectronics(ctx context.Context, userID int64) ([]*models.CarbonElectronic, error)
	CreateElectronicsLog(ctx context.Context, log *models.CarbonElectronicLog) error
	GetElectronicsLogs(ctx context.Context, deviceID int64) ([]*models.CarbonElectronicLog, error)
}

type carbonRepository struct {
	db *sql.DB
}

func NewCarbonRepository(db *sql.DB) CarbonRepository {
	return &carbonRepository{db: db}
}

// ======================== VEHICLE ========================

func (r *carbonRepository) FindVehicleByID(ctx context.Context, id int64) (*models.CarbonVehicle, error) {
	var v models.CarbonVehicle
	err := r.db.QueryRowContext(ctx, `SELECT id, user_id, vehicle_type, fuel_type, name FROM carbon_vehicles WHERE id = $1`, id).
		Scan(&v.ID, &v.UserID, &v.VehicleType, &v.FuelType, &v.Name)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &v, nil
}

func (r *carbonRepository) FindVehicleByUserAndName(ctx context.Context, userID int64, name string) (*models.CarbonVehicle, error) {
	var v models.CarbonVehicle
	err := r.db.QueryRowContext(ctx, `SELECT id, user_id, vehicle_type, fuel_type, name FROM carbon_vehicles WHERE user_id = $1 AND name = $2`, userID, name).
		Scan(&v.ID, &v.UserID, &v.VehicleType, &v.FuelType, &v.Name)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &v, nil
}

func (r *carbonRepository) CreateVehicle(ctx context.Context, v *models.CarbonVehicle) (*models.CarbonVehicle, error) {
	var id int64
	err := r.db.QueryRowContext(ctx, `INSERT INTO carbon_vehicles (user_id, vehicle_type, fuel_type, name) VALUES ($1, $2, $3, $4) RETURNING id`,
		v.UserID, v.VehicleType, v.FuelType, v.Name).Scan(&id)
	if err != nil {
		return nil, err
	}
	
	v.ID = id
	return v, nil
}

func (r *carbonRepository) ListUserVehicles(ctx context.Context, userID int64) ([]*models.CarbonVehicle, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT id, user_id, vehicle_type, fuel_type, name FROM carbon_vehicles WHERE user_id = $1`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var vehicles []*models.CarbonVehicle
	for rows.Next() {
		var v models.CarbonVehicle
		if err := rows.Scan(&v.ID, &v.UserID, &v.VehicleType, &v.FuelType, &v.Name); err != nil {
			return nil, err
		}
		vehicles = append(vehicles, &v)
	}

	// Check for any error encountered during iteration
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return vehicles, nil
}

func (r *carbonRepository) CreateVehicleLog(ctx context.Context, log *models.CarbonVehicleLog) error {
	_, err := r.db.ExecContext(ctx, `INSERT INTO carbon_vehicle_logs (vehicle_id, start_location, end_location, distance_km, duration_minutes, carbon_emission_g) VALUES ($1, $2, $3, $4, $5, $6)`,
		log.VehicleID, log.StartLocation, log.EndLocation, log.DistanceKm, log.DurationMinutes, log.CarbonEmission)
	return err
}

func (r *carbonRepository) GetVehicleLogs(ctx context.Context, vehicleID int64) ([]*models.CarbonVehicleLog, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT id, vehicle_id, start_location, end_location, distance_km, duration_minutes, carbon_emission_g FROM carbon_vehicle_logs WHERE vehicle_id = $1`, vehicleID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var logs []*models.CarbonVehicleLog
	for rows.Next() {
		var log models.CarbonVehicleLog
		if err := rows.Scan(&log.ID, &log.VehicleID, &log.StartLocation, &log.EndLocation, &log.DistanceKm, &log.DurationMinutes, &log.CarbonEmission); err != nil {
			return nil, err
		}
		logs = append(logs, &log)
	}

	// Check for any error encountered during iteration
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return logs, nil
}

// ======================== ELECTRONICS ========================

func (r *carbonRepository) FindElectronicsByID(ctx context.Context, id int64) (*models.CarbonElectronic, error) {
	var e models.CarbonElectronic
	err := r.db.QueryRowContext(ctx, `SELECT id, user_id, device_name, device_type, power_watts FROM carbon_electronics WHERE id = $1`, id).
		Scan(&e.ID, &e.UserID, &e.DeviceName, &e.DeviceType, &e.PowerWatts)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &e, nil
}

func (r *carbonRepository) FindElectronicsByUserAndName(ctx context.Context, userID int64, deviceName string) (*models.CarbonElectronic, error) {
	var e models.CarbonElectronic
	err := r.db.QueryRowContext(ctx, `SELECT id, user_id, device_name, device_type, power_watts FROM carbon_electronics WHERE user_id = $1 AND device_name = $2`, userID, deviceName).
		Scan(&e.ID, &e.UserID, &e.DeviceName, &e.DeviceType, &e.PowerWatts)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &e, nil
}

func (r *carbonRepository) CreateElectronics(ctx context.Context, e *models.CarbonElectronic) (*models.CarbonElectronic, error) {
	var id int64
	err := r.db.QueryRowContext(ctx, `INSERT INTO carbon_electronics (user_id, device_name, device_type, power_watts) VALUES ($1, $2, $3, $4) RETURNING id`,
		e.UserID, e.DeviceName, e.DeviceType, e.PowerWatts).Scan(&id)
	if err != nil {
		return nil, err
	}
	
	e.ID = id
	return e, nil
}

func (r *carbonRepository) ListUserElectronics(ctx context.Context, userID int64) ([]*models.CarbonElectronic, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT id, user_id, device_name, device_type, power_watts FROM carbon_electronics WHERE user_id = $1`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var electronics []*models.CarbonElectronic
	for rows.Next() {
		var e models.CarbonElectronic
		if err := rows.Scan(&e.ID, &e.UserID, &e.DeviceName, &e.DeviceType, &e.PowerWatts); err != nil {
		return nil, err
		}
		electronics = append(electronics, &e)
	}

	// Check for any error encountered during iteration
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return electronics, nil
}

func (r *carbonRepository) CreateElectronicsLog(ctx context.Context, log *models.CarbonElectronicLog) error {
	_, err := r.db.ExecContext(ctx, `INSERT INTO carbon_electronics_logs (device_id, duration_hours, carbon_emission_g) VALUES ($1, $2, $3)`,
		log.DeviceID, log.DurationHours, log.CarbonEmission)
	return err
}

func (r *carbonRepository) GetElectronicsLogs(ctx context.Context, deviceID int64) ([]*models.CarbonElectronicLog, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT id, device_id, duration_hours, carbon_emission_g FROM carbon_electronics_logs WHERE device_id = $1`, deviceID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var logs []*models.CarbonElectronicLog
	for rows.Next() {
		var log models.CarbonElectronicLog
		if err := rows.Scan(&log.ID, &log.DeviceID, &log.DurationHours, &log.CarbonEmission); err != nil {
			return nil, err
		}
		logs = append(logs, &log)
	}

	// Check for any error encountered during iteration
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return logs, nil
}