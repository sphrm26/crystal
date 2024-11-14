package db

import (
	"context"
	"github.com/jackc/pgx/v4/pgxpool"
)

type TaskRepo struct {
	postgres *pgxpool.Pool
}

func (taskRepo *TaskRepo) AddUser(name string, pass string) error {
	_, err := taskRepo.postgres.Exec(context.Background(), "INSERT INTO users (name, pass) VALUES ($1, $2)", name, pass)
	if err != nil {
		return err
	}
	return nil
}
