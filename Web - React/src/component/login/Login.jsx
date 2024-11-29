import { useState } from 'react';
import "./Login.css"

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        document.cookie = "username=" + username + "; max-age=8640000; path=/;";
        document.cookie = "password=" + password + "; max-age=8640000; path=/;";
    }

    return (
        <div className='login'>
            <form className='login' onSubmit={handleSubmit}>
                <label
                    className='login-label'>
                    username:
                    <input
                        className='login-name'
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <label
                    className='login-label'>
                    password:
                    <input
                        className='login-password'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <input type="submit" value={"login"} />
            </form>
        </div>
    )
}

export default Login;