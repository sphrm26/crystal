package task

import (
	"fmt"
	"time"
)

type PlanedTime struct {
	EstimatedTime time.Duration
	StartTime     time.Time
	EndTime       time.Time
	DoneStartTime time.Time
	DoneEndTime   time.Time
}

type Task struct {
	PlanedTime  *PlanedTime
	Title       string
	Description string
	Priority    uint8
	Group       Group
	ID          int
	IsDone      bool
}

type Group struct {
	Name  string
	Color string
}

type Manager struct {
	Tasks          map[int]*Task
	Groups         map[int]*Group
	TaskIdSequence int
}

func NewTaskManager() Manager {
	return Manager{
		Tasks:          make(map[int]*Task),
		Groups:         make(map[int]*Group),
		TaskIdSequence: 1,
	}
}

func (t *Manager) AddTask(task Task) {
	t.Tasks[t.TaskIdSequence] = &task
	t.Tasks[t.TaskIdSequence].ID = t.TaskIdSequence
	t.TaskIdSequence++
}

func (t *Manager) EditTask(id int, task Task) {
	t.Tasks[id] = &task
	t.Tasks[id].ID = id

	fmt.Println("[EditTask]:", t.Tasks[id])
}

func (t *Manager) CompeleteTask(id int) {
	t.Tasks[id].IsDone = true
}

func (t *Manager) GetTaskByDate(startDate time.Time, endDate time.Time) []Task {
	tasksOfDate := make([]Task, 0)
	for _, task := range t.Tasks {
		// completely in that duration (end and start both)
		if task.PlanedTime != nil && startDate.Before(task.PlanedTime.StartTime) && endDate.After(task.PlanedTime.EndTime) {
			tasksOfDate = append(tasksOfDate, *task)
			fmt.Println(task)
		}
	}
	return tasksOfDate
}
