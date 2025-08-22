package service

import (
	"context"
	"errors"

	"github.com/Qodarrz/fiber-app/dto"
	models "github.com/Qodarrz/fiber-app/model"
	"github.com/Qodarrz/fiber-app/repository"
)

type CarbonServiceInterface interface {
	AddVehicleLog(ctx context.Context, userID int64, req *dto.AddVehicleLogDTO) error
	AddElectronicsLog(ctx context.Context, userID int64, req *dto.AddElectronicsLogDTO) error
}

type CarbonService struct {
	carbonRepo repository.CarbonRepository
}

func NewCarbonService(repo repository.CarbonRepository) *CarbonService {
	return &CarbonService{carbonRepo: repo}
}

// ======================== VEHICLE ========================
func (s *CarbonService) AddVehicleLog(ctx context.Context, userID int64, req *dto.AddVehicleLogDTO) error {
	var vehicle *models.CarbonVehicle
	var err error

	if req.VehicleID != nil {
		vehicle, err = s.carbonRepo.FindVehicleByID(ctx, *req.VehicleID)
		if err != nil {
			return err
		}
		if vehicle == nil {
			return errors.New("vehicle not found")
		}
	} else {
		vehicle, err = s.carbonRepo.FindOrCreateVehicle(ctx, &models.CarbonVehicle{
			UserID:      userID, // pakai userID dari JWT
			VehicleType: req.VehicleType,
			FuelType:    req.FuelType,
			Name:        req.VehicleName,
		})
		if err != nil {
			return err
		}
	}

	// Perhitungan emisi karbon
	var factor float64
	switch req.FuelType {
	case "petrol":
		factor = 120.0
	case "diesel":
		factor = 150.0
	case "electric":
		factor = 10.0
	default:
		factor = 100.0
	}
	carbon := req.DistanceKm * factor

	return s.carbonRepo.CreateVehicleLog(ctx, &models.CarbonVehicleLog{
		VehicleID:      vehicle.ID,
		StartLocation:  req.StartLocation,
		EndLocation:    req.EndLocation,
		DistanceKm:     req.DistanceKm,
		DurationMinutes: req.DurationMinutes,
		CarbonEmission: carbon,
	})
}

// ======================== ELECTRONICS ========================
func (s *CarbonService) AddElectronicsLog(ctx context.Context, userID int64, req *dto.AddElectronicsLogDTO) error {
	var device *models.CarbonElectronic
	var err error

	if req.DeviceID != nil {
		device, err = s.carbonRepo.FindElectronicsByID(ctx, *req.DeviceID)
		if err != nil {
			return err
		}
		if device == nil {
			return errors.New("device not found")
		}
	} else {
		device, err = s.carbonRepo.FindOrCreateElectronics(ctx, &models.CarbonElectronic{
			UserID:     userID, // pakai userID dari JWT
			DeviceName: req.DeviceName,
			DeviceType: req.DeviceType,
			PowerWatts: req.PowerWatts,
		})
		if err != nil {
			return err
		}
	}

	const conversionFactor = 0.475 // gram CO2 per Wh
	carbon := float64(device.PowerWatts) * req.DurationHours * conversionFactor

	return s.carbonRepo.CreateElectronicsLog(ctx, &models.CarbonElectronicLog{
		DeviceID:      device.ID,
		DurationHours: req.DurationHours,
		CarbonEmission: carbon,
	})
}
