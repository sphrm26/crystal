import { useState, useEffect } from "react";
import "./Tasks.css"
import { getCookie } from "../login/Login.jsx"

const Tasks = ({
    onSelectEvent,
}) => {
    const [cachedTasks, setCachedTasks] = useState([]);
    const [cachedCategories, setCachedCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");

    const handleSubmit = () => {
        const createCategory = async () => {
            try {
                const response = await fetch("http://185.220.227.124:8080/addCategory", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                    },
                    body: JSON.stringify({
                        category_name: categoryName,
                        user_name: getCookie("username"),
                        password: getCookie("password"),
                    }),
                });
                const data = await response.json();
                if (!data.tasks || !Array.isArray(data.tasks)) {
                    console.error("Invalid data format:", data);
                    return [];
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        createCategory()
    }

    useEffect(() => {
        const fetchTasks = async () => {

            if (cachedTasks.length != 0) {
                return
            }

            try {
                const response = await fetch("http://185.220.227.124:8080/getTasks", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                    },
                    body: JSON.stringify({
                        start_time: 0,
                        end_time: 1797716608,
                        user_name: getCookie("username"),
                        password: getCookie("password"),
                    }),
                });
                const data = await response.json();
                if (!data.tasks || !Array.isArray(data.tasks)) {
                    console.error("Invalid data format:", data);
                    return [];
                }

                setCachedTasks(data.tasks)
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        const fetchCategories = async () => {

            if (cachedCategories.length != 0) {
                return
            }

            try {
                const response = await fetch("http://185.220.227.124:8080/getCategories", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                    },
                    body: JSON.stringify({
                        user_name: getCookie("username"),
                        password: getCookie("password"),
                    }),
                });
                const data = await response.json();

                data.categories.push({
                    Id: 0,
                    Name: "بدون گروه"
                })

                setCachedCategories(data.categories)
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
        fetchCategories();
    }, [cachedTasks]);

    const hanleClickedEvent = (task) => {
        const Category = cachedCategories.find(cat => cat.Id === task.CategoryId);
        onSelectEvent({
            id: task.ID,
            title: task.Title,
            start: task.PlanedTime.StartTime,
            end: task.PlanedTime.EndTime,
            category: Category.Name
        })
    };


    const categoryTasks = cachedCategories.reduce((acc, category) => {
        acc[category.Id] = {
            name: category.Name,
            tasks: cachedTasks.filter(task => task.CategoryId === category.Id),
        };
        return acc;
    }, {});

    return (
        <div className="tasks">
            <div>
                <form onSubmit={handleSubmit}>
                    <label>
                        category name:
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                    </label>
                    <input type="submit" value={"create category"} />
                </form>
            </div>
            <div className="task-board">
                {Object.entries(categoryTasks).map(([CategoryId, { name, tasks }]) => (
                    <div className="task-column" key={CategoryId}>
                        <h2 className="column-title">{name}</h2>
                        <div className="task-list">
                            {tasks.map(task => (
                                <div className="task" key={task.ID} onClick={() => hanleClickedEvent(task)}>
                                    <h3 className="task-title">{task.Title}</h3>
                                    <p className="task-desc">{task.Description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

}

export default Tasks;