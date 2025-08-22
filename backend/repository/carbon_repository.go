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
	FindOrCreateVehicle(ctx context.Context, v *models.CarbonVehicle) (*models.CarbonVehicle, error)
	CreateVehicleLog(ctx context.Context, log *models.CarbonVehicleLog) error

	// Electronics
	FindElectronicsByID(ctx context.Context, id int64) (*models.CarbonElectronic, error)
	FindOrCreateElectronics(ctx context.Context, e *models.CarbonElectronic) (*models.CarbonElectronic, error)
	CreateElectronicsLog(ctx context.Context, log *models.CarbonElectronicLog) error
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

func (r *carbonRepository) FindOrCreateVehicle(ctx context.Context, v *models.CarbonVehicle) (*models.CarbonVehicle, error) {
	var id int64
	err := r.db.QueryRowContext(ctx, `SELECT id FROM carbon_vehicles WHERE user_id = $1 AND name = $2 LIMIT 1`, v.UserID, v.Name).Scan(&id)
	if err == sql.ErrNoRows {
		err = r.db.QueryRowContext(ctx, `INSERT INTO carbon_vehicles (user_id, vehicle_type, fuel_type, name) VALUES ($1, $2, $3, $4) RETURNING id`,
			v.UserID, v.VehicleType, v.FuelType, v.Name).Scan(&id)
		if err != nil {
			return nil, err
		}
	} else if err != nil {
		return nil, err
	}
	v.ID = id
	return v, nil
}

func (r *carbonRepository) CreateVehicleLog(ctx context.Context, log *models.CarbonVehicleLog) error {
	_, err := r.db.ExecContext(ctx, `INSERT INTO carbon_vehicle_logs (vehicle_id, start_location, end_location, distance_km, duration_minutes, carbon_emission_g) VALUES ($1,$2,$3,$4,$5,$6)`,
		log.VehicleID, log.StartLocation, log.EndLocation, log.DistanceKm, log.DurationMinutes, log.CarbonEmission)
	return err
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

func (r *carbonRepository) FindOrCreateElectronics(ctx context.Context, e *models.CarbonElectronic) (*models.CarbonElectronic, error) {
	var id int64
	err := r.db.QueryRowContext(ctx, `SELECT id FROM carbon_electronics WHERE user_id = $1 AND device_name = $2 LIMIT 1`, e.UserID, e.DeviceName).Scan(&id)
	if err == sql.ErrNoRows {
		err = r.db.QueryRowContext(ctx, `INSERT INTO carbon_electronics (user_id, device_name, device_type, power_watts) VALUES ($1,$2,$3,$4) RETURNING id`,
			e.UserID, e.DeviceName, e.DeviceType, e.PowerWatts).Scan(&id)
		if err != nil {
			return nil, err
		}
	} else if err != nil {
		return nil, err
	}
	e.ID = id
	return e, nil
}

func (r *carbonRepository) CreateElectronicsLog(ctx context.Context, log *models.CarbonElectronicLog) error {
	_, err := r.db.ExecContext(ctx, `INSERT INTO carbon_electronics_logs (device_id, duration_hours, carbon_emission_g) VALUES ($1,$2,$3)`,
		log.DeviceID, log.DurationHours, log.CarbonEmission)
	return err
}
