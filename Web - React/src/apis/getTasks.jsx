import { getCookie } from "../component/login/Login.jsx"

export default async function FetchTasks(startTime, endTime) {
    const fetchTasks = async () => {
        try {
            const response = await fetch("http://185.220.227.124:8080/getTasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    start_time: startTime,
                    end_time: endTime,
                    user_name: getCookie("username"),
                    password: getCookie("password"),
                }),
            });
            const data = await response.json();
            if (!data.tasks || !Array.isArray(data.tasks)) {
                console.error("Invalid data format:", data);
                return [];
            }

            return data.tasks
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    return fetchTasks()
}