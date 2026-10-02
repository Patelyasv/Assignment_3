import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

    const [empid, setEmpid] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const login = (e) => {

        e.preventDefault();

        console.log("Login button clicked");

        navigate("/home");
    };

    return (

        <div>

            <h1>Employee Login</h1>

            <form onSubmit={login}>

                <label>Employee ID:</label>

                <input
                    type="text"
                    value={empid}
                    onChange={(e) => setEmpid(e.target.value)}
                />

                <br />
                <br />

                <label>Password:</label>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br />
                <br />

                <button type="submit">
                    Login
                </button>

            </form>

        </div>

    );
}

export default Login;