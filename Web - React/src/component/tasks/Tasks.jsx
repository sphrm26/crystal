import { useState, useEffect } from "react";
import "./Tasks.css"
import { getCookie } from "../login/Login.jsx"


function Tasks() {
    const [cachedTasks, setCachedTasks] = useState();

    useEffect(() => {
        const fetchTasks = async () => {
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

        fetchTasks();
    }, [cachedTasks]);

    console.log("sepehr: ", cachedTasks.length)

    return (
        <div className='login'>
            سلام
            {cachedTasks.map((item, i) => (
                <div key={i}>
                    {item}
                </div>
            ))}
        </div>
    )
}

export default Tasks;