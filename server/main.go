package main

import (
	"encoding/json"
	"file/db"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/spf13/cast"
	"net/http"
	"time"
)

func main() {
	taskRepo := db.NewTaskRepo()

	router := gin.Default()

	router.Use(cors.Default())

	router.POST("/addTask", func(c *gin.Context) {
		data, err := GetData(c)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		userId := taskRepo.FindUser(cast.ToString(data["user_name"]), cast.ToString(data["password"]))

		taskId, err := taskRepo.AddTask(
			cast.ToString(data["title"]),
			time.Unix(cast.ToInt64(data["start_time"]), 0),
			time.Unix(cast.ToInt64(data["end_time"]), 0),
			userId)
		if err != nil {
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "ok", "task_id": taskId})
	})

	router.POST("/EditTask", func(c *gin.Context) {
		data, err := GetData(c)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		userId := taskRepo.FindUser(cast.ToString(data["user_name"]), cast.ToString(data["password"]))

		err = taskRepo.EditTask(
			cast.ToInt64(data["id"]),
			cast.ToString(data["title"]),
			time.Unix(cast.ToInt64(data["start_time"]), 0),
			time.Unix(cast.ToInt64(data["end_time"]), 0),
			userId,
		)
		if err != nil {
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "ok"})
	})

	router.POST("/deleteTask", func(c *gin.Context) {
		data, err := GetData(c)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		userId := taskRepo.FindUser(cast.ToString(data["user_name"]), cast.ToString(data["password"]))

		err = taskRepo.DeleteTask(
			cast.ToInt64(data["id"]),
			userId,
		)
		if err != nil {
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "ok"})
	})

	router.POST("/getTasks", func(c *gin.Context) {
		data, err := GetData(c)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		userId := taskRepo.FindUser(cast.ToString(data["user_name"]), cast.ToString(data["password"]))

		tasks := taskRepo.GetTasksByDate(
			time.Unix(cast.ToInt64(data["start_time"]), 0),
			time.Unix(cast.ToInt64(data["end_time"]), 0),
			userId,
		)

		c.JSON(http.StatusOK, gin.H{"tasks": tasks})
	})

	err := router.Run("0.0.0.0:8080")
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
