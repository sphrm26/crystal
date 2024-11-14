package main

import (
	"encoding/json"
	"file/task"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/spf13/cast"
	"net/http"
	"time"
)

func main() {
	taskManager := task.NewTaskManager()

	router := gin.Default()

	router.Use(cors.Default())

	router.POST("/addTask", func(c *gin.Context) {
		data, err := GetData(c)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		taskManager.AddTask(task.Task{
			PlanedTime: &task.PlanedTime{
				EstimatedTime: 0,
				StartTime:     time.Unix(cast.ToInt64(data["start_time"]), 0),
				EndTime:       time.Unix(cast.ToInt64(data["end_time"]), 0),
				DoneStartTime: time.Time{},
				DoneEndTime:   time.Time{},
			},
			Title:       cast.ToString(data["title"]),
			Description: cast.ToString(data["description"]),
			Priority:    cast.ToUint8(data["priority"]),
			Group:       task.Group{},
		})
		c.JSON(http.StatusOK, gin.H{"message": "ok"})
	})

	router.POST("/EditTask", func(c *gin.Context) {
		data, err := GetData(c)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		taskManager.EditTask(cast.ToInt(data["id"]), task.Task{
			PlanedTime: &task.PlanedTime{
				EstimatedTime: 0,
				StartTime:     time.Unix(cast.ToInt64(data["start_time"]), 0),
				EndTime:       time.Unix(cast.ToInt64(data["end_time"]), 0),
				DoneStartTime: time.Time{},
				DoneEndTime:   time.Time{},
			},
			Title:       cast.ToString(data["title"]),
			Description: cast.ToString(data["description"]),
			Priority:    cast.ToUint8(data["priority"]),
			Group:       task.Group{},
		})
		c.JSON(http.StatusOK, gin.H{"message": "ok"})
	})

	router.POST("/getTasks", func(c *gin.Context) {
		data, err := GetData(c)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		tasks := taskManager.GetTaskByDate(time.Unix(cast.ToInt64(data["start_time"]), 0), time.Unix(cast.ToInt64(data["end_time"]), 0))

		c.JSON(http.StatusOK, gin.H{"tasks": tasks})
	})

	//go func() {
	//	var stdout bytes.Buffer
	//	var stderr bytes.Buffer
	//	cmd := exec.Command("sh", "-c", "cd /web && serve -p 3001")
	//	cmd.Stdout = &stdout
	//	cmd.Stderr = &stderr
	//	err := cmd.Run()
	//	if err != nil {
	//		fmt.Println("error in run html server", stderr.String())
	//	}
	//}()

	err := router.Run("127.0.0.1:8080")
	if err != nil {
		return
	}
}

func GetData(c *gin.Context) (map[string]interface{}, error) {
	req := c.Request
	decoder := json.NewDecoder(req.Body)

	var data map[string]interface{}
	err := decoder.Decode(&data)
	if err != nil {
		fmt.Printf("Error preparing data: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return nil, err
	}
	return data, nil
}
