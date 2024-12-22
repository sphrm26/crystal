import { useState, useEffect } from "react";
import "./Tasks.css"
import { getCookie } from "../login/Login.jsx"


function Tasks() {
    const [cachedTasks, setCachedTasks] = useState([]);
    const [cachedGroups, setCachedGroups] = useState([]);
    const [groupName, setGroupName] = useState("");

    const handleSubmit = () => {
        const createGroup = async () => {
            try {
                const response = await fetch("http://185.220.227.124:8080/addGroup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                    },
                    body: JSON.stringify({
                        group_name: groupName,
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

        createGroup()
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
                console.log("sepehr: ", data.tasks)
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        const fetchGroups = async () => {

            if (cachedTasks.length != 0) {
                return
            }

            try {
                const response = await fetch("http://185.220.227.124:8080/getGroups", {
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

                data.groups.push({
                    Id :0,
                    Name: "بدون گروه"
                })

                console.log("sepehr", data.groups)

                setCachedGroups(data.groups)
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
        fetchGroups();
    }, [cachedTasks]);

    const groupedTasks = cachedGroups.reduce((acc, group) => {
        console.log("sepehr: ", group.Id)
        acc[group.Id] = {
            name: group.Name, // نام گروه از `cachedGroups`
            tasks: cachedTasks.filter(task => task.GroupId === group.Id), // تسک‌های مرتبط با گروه
        };
        return acc;
    }, {});

    return (
        <div className="tasks">
            <div>
                <form onSubmit={handleSubmit}>
                    <label>
                        group name:
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                    </label>
                    <input type="submit" value={"create group"} />
                </form>
            </div>
            <div className="task-board">
            {Object.entries(groupedTasks).map(([GroupId, { name, tasks }]) => (
                <div className="task-column" key={GroupId}>
                    <h2 className="column-title">{name}</h2>
                    <div className="task-list">
                        {tasks.map(task => (
                            <div className="task" key={task.Id}>
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