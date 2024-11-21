package db

import (
	"context"
	"file/task"
	"fmt"
	"github.com/jackc/pgx/v4/pgxpool"
	"time"
)

type TaskRepo struct {
	postgres *pgxpool.Pool
}

func NewTaskRepo() *TaskRepo {
	connectionString := fmt.Sprintf("postgresql://pirate:QQQ111qqq@localhost:5432/crystal")
	//connectionString := fmt.Sprintf("postgresql://postgres:z3A70OxmV8@psql-postgresql:5432/crystal")
	pool, err := pgxpool.Connect(context.Background(), connectionString)
	if err != nil {
		panic(err)
	}
	return &TaskRepo{postgres: pool}
}

func (taskRepo *TaskRepo) AddUser(name string, pass string) error {
	_, err := taskRepo.postgres.Exec(context.Background(), "INSERT INTO users (name, pass) VALUES ($1, $2)", name, pass)
	if err != nil {
		return err
	}
	return nil
}

func (taskRepo *TaskRepo) FindUser(name string, pass string) int32 {
	var userId int32
	taskRepo.postgres.QueryRow(context.Background(), `
select user_id from users
               where name = $1 and password = $2`, name, pass).Scan(&userId)
	return userId
}

func (taskRepo *TaskRepo) AddTask(title string, startTime time.Time, endTime time.Time, userId int32) (int64, error) {
	var taskId int64
	err := taskRepo.postgres.QueryRow(context.Background(), `
INSERT INTO 
    tasks (title, start_time, end_time, user_id)
	VALUES ($1, $2, $3, $4) RETURNING id
`, title, startTime, endTime, userId).Scan(&taskId)
	if err != nil {
		panic(err)
	}
	return taskId, nil
}

func (taskRepo *TaskRepo) EditTask(taskId int64, title string, startTime time.Time, endTime time.Time, userId int32) error {
	err := taskRepo.postgres.QueryRow(context.Background(), `
	update tasks 
	set title = $2, start_time = $3, end_time = $4, user_id = $5
	where id = $1;
`, taskId, title, startTime, endTime, userId)
	if err != nil {
		panic(err)
	}
	fmt.Println(taskId)
	return nil
}

func (taskRepo *TaskRepo) GetTasksByDate(startDate time.Time, endDate time.Time, userId int32) []task.Task {
	resRaw, err := taskRepo.postgres.Query(context.Background(), `
	select * from public.tasks
		where 
		    user_id = $1
			and start_time >= $2
		    and end_time <= $3
`, userId, startDate, endDate)

	fmt.Println(startDate)
	fmt.Println(endDate)

	if err != nil {
		return nil
	}

	tasks := make([]task.Task, 0)
	for resRaw.Next() {
		var id int64
		var title string
		var startTime time.Time
		var endTime time.Time
		var uId int32

		err := resRaw.Scan(&id, &title, &startTime, &endTime, &uId)
		if err != nil {
			return nil
		}
		tasks = append(tasks, task.Task{
			PlanedTime: &task.PlanedTime{
				StartTime: startTime,
				EndTime:   endTime,
			},
			Title: title,
			ID:    id,
		})
	}

	return tasks
}
