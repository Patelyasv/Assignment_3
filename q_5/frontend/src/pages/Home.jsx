import { Link, useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();


    const logout = () => {

        localStorage.removeItem("token");

        navigate("/");

    };


    return (

        <div>

            <h1>Employee Home Page</h1>

            <h2>Welcome Employee</h2>

            <hr />

            <h3>Menu</h3>

            <p>
                <Link to="/profile">
                    Page 1 - Employee Profile
                </Link>
            </p>

            <p>
                <Link to="/leave">
                    Page 2 - Leave Application
                </Link>
            </p>

            <button onClick={logout}>
                Logout
            </button>

        </div>

    );

}

export default Home;