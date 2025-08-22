package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"time"

	model "github.com/Qodarrz/fiber-app/model"
)

type MissionRepositoryInterface interface {
	FindByID(ctx context.Context, id int64) (*model.Mission, error)
	FindActiveMissions(ctx context.Context) ([]*model.Mission, error)
	AssignMissionToUser(ctx context.Context, userID, missionID int64) error
	MarkMissionCompleted(ctx context.Context, userID, missionID int64) error
	HasUserCompletedMission(ctx context.Context, userID, missionID int64) (bool, error)
}

type missionRepository struct {
	db *sql.DB
}

func NewMissionRepository(db *sql.DB) MissionRepositoryInterface {
	return &missionRepository{db: db}
}

// Ambil mission berdasarkan ID
func (r *missionRepository) FindByID(ctx context.Context, id int64) (*model.Mission, error) {
	mission := &model.Mission{}
	query := `
		SELECT id, title, description, mission_type, points_reward, gives_badge, badge_id,
		       carbon_reduction_g, criteria, created_at, expired_at
		FROM missions
		WHERE id = $1
	`
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&mission.ID, &mission.Title, &mission.Description, &mission.MissionType,
		&mission.PointsReward, &mission.GivesBadge, &mission.BadgeID,
		&mission.Criteria, &mission.CreatedAt, &mission.ExpiredAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return mission, nil
}

func (r *missionRepository) FindActiveMissions(ctx context.Context) ([]*model.Mission, error) {
	query := `
		SELECT id, title, description, mission_type, points_reward, gives_badge, badge_id,
		       carbon_reduction_g, criteria, created_at, expired_at
		FROM missions
		WHERE expired_at IS NULL OR expired_at > $1
	`
	rows, err := r.db.QueryContext(ctx, query, time.Now())
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var missions []*model.Mission
	for rows.Next() {
		m := &model.Mission{}
		if err := rows.Scan(
			&m.ID, &m.Title, &m.Description, &m.MissionType, &m.PointsReward,
			&m.GivesBadge, &m.BadgeID, &m.Criteria,
			&m.CreatedAt, &m.ExpiredAt,
		); err != nil {
			return nil, err
		}
		missions = append(missions, m)
	}
	return missions, nil
}

// Assign mission ke user
func (r *missionRepository) AssignMissionToUser(ctx context.Context, userID, missionID int64) error {
	query := `
		INSERT INTO user_missions (user_id, mission_id, created_at)
		VALUES ($1, $2, $3)
		ON CONFLICT (user_id, mission_id) DO NOTHING
	`
	_, err := r.db.ExecContext(ctx, query, userID, missionID, time.Now())
	return err
}

// Tandai mission selesai
func (r *missionRepository) MarkMissionCompleted(ctx context.Context, userID, missionID int64) error {
	query := `
		UPDATE user_missions 
		SET completed_at = $1
		WHERE user_id = $2 AND mission_id = $3
	`
	_, err := r.db.ExecContext(ctx, query, time.Now(), userID, missionID)
	return err
}

// Cek apakah user sudah menyelesaikan mission
func (r *missionRepository) HasUserCompletedMission(ctx context.Context, userID, missionID int64) (bool, error) {
	query := `
		SELECT completed_at FROM user_missions
		WHERE user_id = $1 AND mission_id = $2
	`
	var completedAt sql.NullTime
	err := r.db.QueryRowContext(ctx, query, userID, missionID).Scan(&completedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return completedAt.Valid, nil
}

func (r *missionRepository) CompleteMissionWithReward(ctx context.Context, userID, missionID int64) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// 1. Tandai mission selesai
	_, err = tx.ExecContext(ctx, `
		UPDATE user_missions
		SET completed_at = $1
		WHERE user_id = $2 AND mission_id = $3
	`, time.Now(), userID, missionID)
	if err != nil {
		return err
	}

	// 2. Ambil detail mission
	var points int
	var givesBadge bool
	var badgeID sql.NullInt64

	err = tx.QueryRowContext(ctx, `
		SELECT points_reward, gives_badge, badge_id
		FROM missions
		WHERE id = $1
	`, missionID).Scan(&points, &givesBadge, &badgeID)
	if err != nil {
		return err
	}

	// 3. Kalau ada poin, update total & insert transaksi
	if points > 0 {
		// update total poin user
		_, err = tx.ExecContext(ctx, `
			UPDATE points
			SET total_points = total_points + $1
			WHERE user_id = $2
		`, points, userID)
		if err != nil {
			return err
		}

		// insert transaksi poin
		_, err = tx.ExecContext(ctx, `
			INSERT INTO point_transactions (user_id, amount, direction, source, reference_type, reference_id, note, created_at)
			VALUES ($1, $2, 'in', 'mission', 'mission', $3, 'Reward for mission completion', $4)
		`, userID, points, missionID, time.Now())
		if err != nil {
			return err
		}
	}

	// 4. Kalau ada badge, insert ke user_badges (jangan duplikat)
	if givesBadge && badgeID.Valid {
		_, err = tx.ExecContext(ctx, `
			INSERT INTO user_badges (user_id, badge_id, redeemed_at, created_at)
			VALUES ($1, $2, $3, $3)
			ON CONFLICT (user_id, badge_id) DO NOTHING
		`, userID, badgeID.Int64, time.Now())
		if err != nil {
			return err
		}
	}

	return tx.Commit()
}

func (r *missionRepository) ValidateAndCompleteMission(ctx context.Context, userID, missionID int64) error {
	// Ambil mission & criteria
	var m model.Mission
	err := r.db.QueryRowContext(ctx, `
		SELECT id, mission_type, criteria, points_reward, gives_badge, badge_id
		FROM missions WHERE id = $1
	`, missionID).Scan(&m.ID, &m.MissionType, &m.Criteria, &m.PointsReward, &m.GivesBadge, &m.BadgeID)
	if err != nil {
		return err
	}

	// Parse criteria JSON
	var criteria map[string]interface{}
	if err := json.Unmarshal(m.Criteria, &criteria); err != nil {
		return err
	}

	// === CEK LOG TERKAIT ===
	ok := false

	switch m.MissionType {
	case model.CarbonReduction:
		// contoh: cek total carbon_reduction_g dari user_vehicle_logs
		var total float64
		err = r.db.QueryRowContext(ctx, `
			SELECT COALESCE(SUM(carbon_emission_g), 0)
			FROM carbon_vehicle_logs cvl
			JOIN carbon_vehicles cv ON cv.id = cvl.vehicle_id
			WHERE cv.user_id = $1
		`, userID).Scan(&total)
		if err != nil {
			return err
		}
		if min, okCrit := criteria["min_reduction"].(float64); okCrit && total >= min {
			ok = true
		}

	case model.Activity:
		// contoh: cek apakah user punya log dengan keyword tertentu
		var exists bool
		err = r.db.QueryRowContext(ctx, `
			SELECT EXISTS(
				SELECT 1 FROM activity_logs 
				WHERE user_id = $1 AND activity ILIKE $2
			)
		`, userID, "%"+criteria["keyword"].(string)+"%").Scan(&exists)
		if err != nil {
			return err
		}
		ok = exists

		// case Streak, Custom dll bisa ditambah
	}

	if !ok {
		return errors.New("criteria not fulfilled, mission not completed")
	}

	// === kalau lolos criteria → complete mission + reward ===
	return r.CompleteMissionWithReward(ctx, userID, missionID)
}
