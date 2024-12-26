import { getCookie } from "../component/login/Login.jsx"

export default async function FetchCategories() {
    const fetchCategories = async () => {
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

            return data.categories

        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    return fetchCategories()
}