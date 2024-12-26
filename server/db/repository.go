package db

import (
	"context"
	"file/entities"
	"fmt"
	"github.com/jackc/pgx/v4/pgxpool"
	"time"
)

type TaskRepo struct {
	postgres *pgxpool.Pool
}

func NewTaskRepo() *TaskRepo {
	//connectionString := fmt.Sprintf("postgresql://pirate:QQQ111qqq@localhost:5432/crystal")
	connectionString := fmt.Sprintf("postgresql://postgres:z3A70OxmV8@psql-postgresql:5432/crystal")
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

func (taskRepo *TaskRepo) AddTask(title string, startTime time.Time, endTime time.Time, userId int32, categoryId int64) (int64, error) {
	var taskId int64
	err := taskRepo.postgres.QueryRow(context.Background(), `
INSERT INTO 
    tasks (title, start_time, end_time, user_id, category_id)
	VALUES ($1, $2, $3, $4, $5) RETURNING id
`, title, startTime, endTime, userId, categoryId).Scan(&taskId)
	if err != nil {
		panic(err)
	}
	return taskId, nil
}

func (taskRepo *TaskRepo) EditTask(taskId int64, title string, startTime time.Time, endTime time.Time, userId int32, categoryId int64) error {
	taskRepo.postgres.QueryRow(context.Background(), `
	update tasks 
	set title = $2, start_time = $3, end_time = $4, user_id = $5, category_id = $6
	where id = $1;
`, taskId, title, startTime, endTime, userId, categoryId)
	return nil
}

func (taskRepo *TaskRepo) DeleteTask(taskId int64, userId int32) error {
	taskRepo.postgres.QueryRow(context.Background(), `
	delete from tasks where id = $1 and user_id = $2	
	`, taskId, userId)
	return nil
}

func (taskRepo *TaskRepo) GetTasksByDate(startDate time.Time, endDate time.Time, userId int32) []entities.Task {
	resRaw, err := taskRepo.postgres.Query(context.Background(), `
	select id, title, start_time, end_time, user_id, category_id from public.tasks
		where 
		    user_id = $1
			and start_time >= $2
		    and end_time <= $3
`, userId, startDate, endDate)

	if err != nil {
		return nil
	}

	tasks := make([]entities.Task, 0)
	for resRaw.Next() {
		var id int64
		var title string
		var startTime time.Time
		var endTime time.Time
		var userId int32
		var categoryId int64

		err := resRaw.Scan(&id, &title, &startTime, &endTime, &userId, &categoryId)
		if err != nil {
			return nil
		}
		tasks = append(tasks, entities.Task{
			PlanedTime: &entities.PlanedTime{
				StartTime: startTime,
				EndTime:   endTime,
			},
			Title:      title,
			ID:         id,
			CategoryId: categoryId,
		})
	}

	return tasks
}

func (taskRepo *TaskRepo) AddCategory(categoryName string, userId int32) (int64, error) {
	var categoryId int64
	err := taskRepo.postgres.QueryRow(context.Background(), `
INSERT INTO 
    categories (category_name, user_id)
	VALUES ($1, $2) RETURNING id
`, categoryName, userId).Scan(&categoryId)
	if err != nil {
		fmt.Println("Error inserting category", err)
	}
	return categoryId, nil
}

func (taskRepo *TaskRepo) GetCategoryIdByName(categoryName string, userId int32) (int64, error) {
	var categoryId int64
	err := taskRepo.postgres.QueryRow(context.Background(), `
SELECT id from
    categories where user_id = $1 and category_name = $2 limit 1
`, userId, categoryName).Scan(&categoryId)
	if err != nil {
		fmt.Println("Error getting category", err)
	}
	return categoryId, nil
}

func (taskRepo *TaskRepo) GetCategoriesByUserId(userId int32) ([]entities.Category, error) {
	resRaw, err := taskRepo.postgres.Query(context.Background(), `
	select id, category_name from public.categories
		where
		    user_id = $1	
`, userId)
	if err != nil {
		return nil, err
	}

	categories := make([]entities.Category, 0)
	for resRaw.Next() {
		var id int64
		var name string

		err := resRaw.Scan(&id, &name)
		if err != nil {
			panic(err)
		}
		categories = append(categories, entities.Category{
			Name: name,
			Id:   id,
		})
	}

	return categories, nil
}
