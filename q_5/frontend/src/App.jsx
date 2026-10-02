import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Leave from "./pages/Leave";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/home" element={<Home />} />

                <Route path="/profile" element={<Profile />} />

                <Route path="/leave" element={<Leave />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;