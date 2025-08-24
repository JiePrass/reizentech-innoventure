// service/carbon_service.go
package service

import (
	"context"
	"errors"

	"github.com/Qodarrz/fiber-app/dto"
	models "github.com/Qodarrz/fiber-app/model"
	"github.com/Qodarrz/fiber-app/repository"
)

type CarbonServiceInterface interface {
	CreateVehicle(ctx context.Context, userID int64, req *dto.CreateVehicleDTO) (*models.CarbonVehicle, error)
	ListUserVehicles(ctx context.Context, userID int64) ([]*models.CarbonVehicle, error)
	AddVehicleLog(ctx context.Context, userID int64, req *dto.AddVehicleLogDTO) error
	GetVehicleLogs(ctx context.Context, userID, vehicleID int64) ([]*models.CarbonVehicleLog, error)
	
	CreateElectronic(ctx context.Context, userID int64, req *dto.CreateElectronicDTO) (*models.CarbonElectronic, error)
	ListUserElectronics(ctx context.Context, userID int64) ([]*models.CarbonElectronic, error)
	AddElectronicsLog(ctx context.Context, userID int64, req *dto.AddElectronicsLogDTO) error
	GetElectronicsLogs(ctx context.Context, userID, deviceID int64) ([]*models.CarbonElectronicLog, error)
	// Electronics methods would be similarly updated
}

type CarbonService struct {
	carbonRepo  repository.CarbonRepository
	missionRepo repository.CheckMissionRepositoryInterface
}

func NewCarbonService(carbonRepo repository.CarbonRepository, missionRepo repository.CheckMissionRepositoryInterface) *CarbonService {
	return &CarbonService{
		carbonRepo:  carbonRepo,
		missionRepo: missionRepo,
	}
}


// ======================== VEHICLE ========================

func (s *CarbonService) CreateVehicle(ctx context.Context, userID int64, req *dto.CreateVehicleDTO) (*models.CarbonVehicle, error) {
	// Check if vehicle with same name already exists for this user
	existing, err := s.carbonRepo.FindVehicleByUserAndName(ctx, userID, req.Name)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, errors.New("vehicle with this name already exists for this user")
	}

	vehicle := &models.CarbonVehicle{
		UserID:      userID,
		VehicleType: models.VehicleType(req.VehicleType),
		FuelType:    models.FuelType(req.FuelType),
		Name:        req.Name,
	}

    

	return s.carbonRepo.CreateVehicle(ctx, vehicle)
}

func (s *CarbonService) ListUserVehicles(ctx context.Context, userID int64) ([]*models.CarbonVehicle, error) {
	return s.carbonRepo.ListUserVehicles(ctx, userID)
}

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
        if vehicle.UserID != userID {
            return errors.New("vehicle does not belong to user")
        }
    } else {
        existing, err := s.carbonRepo.FindVehicleByUserAndName(ctx, userID, req.VehicleName)
        if err != nil {
            return err
        }
        if existing != nil {
            vehicle = existing
        } else {
            vehicle, err = s.carbonRepo.CreateVehicle(ctx, &models.CarbonVehicle{
                UserID:      userID,
                VehicleType: models.VehicleType(req.VehicleType),
                FuelType:    models.FuelType(req.FuelType),
                Name:        req.VehicleName,
            })
            if err != nil {
                return err
            }
        }
    }

    // Hitung emisi
    var factor float64
    switch vehicle.FuelType {
    case models.FuelPetrol:
        factor = 120.0
    case models.FuelDiesel:
        factor = 150.0
    case models.FuelElectric:
        factor = 10.0
    case models.FuelNone:
        factor = 0
    default:
        factor = 100.0
    }
    carbon := req.DistanceKm * factor

    // Simpan log
    err = s.carbonRepo.CreateVehicleLog(ctx, &models.CarbonVehicleLog{
        VehicleID:       vehicle.ID,
        StartLocation:   req.StartLocation,
        EndLocation:     req.EndLocation,
        DistanceKm:      req.DistanceKm,
        DurationMinutes: req.DurationMinutes,
        CarbonEmission:  carbon,
    })
    if err != nil {
        return err
    }

    // 🔥 Cek missions setelah tambah log
    return s.missionRepo.CheckAllUserMissions(ctx, userID)
}


func (s *CarbonService) GetVehicleLogs(ctx context.Context, userID, vehicleID int64) ([]*models.CarbonVehicleLog, error) {
	vehicle, err := s.carbonRepo.FindVehicleByID(ctx, vehicleID)
	if err != nil {
		return nil, err
	}
	if vehicle == nil {
		return nil, errors.New("vehicle not found")
	}
	if vehicle.UserID != userID {
		return nil, errors.New("vehicle does not belong to user")
	}
	
	return s.carbonRepo.GetVehicleLogs(ctx, vehicleID)
}

	// Electronics


// ======================== ELECTRONICS ========================

func (s *CarbonService) CreateElectronic(ctx context.Context, userID int64, req *dto.CreateElectronicDTO) (*models.CarbonElectronic, error) {
	// Check if electronic device with same name already exists for this user
	existing, err := s.carbonRepo.FindElectronicsByUserAndName(ctx, userID, req.DeviceName)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, errors.New("electronic device with this name already exists for this user")
	}

	electronic := &models.CarbonElectronic{
		UserID:     userID,
		DeviceName: req.DeviceName,
		DeviceType: req.DeviceType,
		PowerWatts: req.PowerWatts,
	}

	return s.carbonRepo.CreateElectronics(ctx, electronic)
}

func (s *CarbonService) ListUserElectronics(ctx context.Context, userID int64) ([]*models.CarbonElectronic, error) {
	return s.carbonRepo.ListUserElectronics(ctx, userID)
}

func (s *CarbonService) AddElectronicsLog(ctx context.Context, userID int64, req *dto.AddElectronicsLogDTO) error {
    var device *models.CarbonElectronic
    var err error

    if req.DeviceID != nil {
        device, err = s.carbonRepo.FindElectronicsByID(ctx, *req.DeviceID)
        if err != nil {
            return err
        }
        if device == nil {
            return errors.New("electronic device not found")
        }
        if device.UserID != userID {
            return errors.New("electronic device does not belong to user")
        }
    } else {
        existing, err := s.carbonRepo.FindElectronicsByUserAndName(ctx, userID, req.DeviceName)
        if err != nil {
            return err
        }
        if existing != nil {
            device = existing
        } else {
            device, err = s.carbonRepo.CreateElectronics(ctx, &models.CarbonElectronic{
                UserID:     userID,
                DeviceName: req.DeviceName,
                DeviceType: req.DeviceType,
                PowerWatts: req.PowerWatts,
            })
            if err != nil {
                return err
            }
        }
    }

    // Hitung emisi
    const conversionFactor = 0.475
    carbon := float64(device.PowerWatts) * req.DurationHours * conversionFactor

    // Simpan log
    err = s.carbonRepo.CreateElectronicsLog(ctx, &models.CarbonElectronicLog{
        DeviceID:       device.ID,
        DurationHours:  req.DurationHours,
        CarbonEmission: carbon,
    })
    if err != nil {
        return err
    }

    // 🔥 Cek missions setelah tambah log
    return s.missionRepo.CheckAllUserMissions(ctx, userID)
}

func (s *CarbonService) GetElectronicsLogs(ctx context.Context, userID, deviceID int64) ([]*models.CarbonElectronicLog, error) {
	// First verify the device belongs to the user
	device, err := s.carbonRepo.FindElectronicsByID(ctx, deviceID)
	if err != nil {
		return nil, err
	}
	if device == nil {
		return nil, errors.New("electronic device not found")
	}
	if device.UserID != userID {
		return nil, errors.New("electronic device does not belong to user")
	}
	
	return s.carbonRepo.GetElectronicsLogs(ctx, deviceID)
}