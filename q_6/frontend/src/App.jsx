import { useState } from "react";

function App() {

    const [city, setCity] = useState("");

    const [weather, setWeather] = useState(null);

    const [message, setMessage] = useState("");


    const getWeather = async () => {

        if (city === "") {

            setMessage("Please enter city name");

            return;
        }


        try {

            const response = await fetch(
                `http://localhost:5000/weather?city=${city}`
            );

            const data = await response.json();


            if (data.message) {

                setMessage(data.message);
                setWeather(null);

                return;
            }


            setWeather(data);

            setMessage("");

        } catch (error) {

            setMessage("Unable to get weather");

        }

    };


    return (

        <div>

            <h1>Weather Utility</h1>


            <input
                type="text"
                placeholder="Enter city name"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />


            <button onClick={getWeather}>
                Get Weather
            </button>


            <br />
            <br />


            {message && (

                <p style={{ color: "red" }}>
                    {message}
                </p>

            )}


            {weather && (

                <div>

                    <h2>
                        {weather.city}, {weather.country}
                    </h2>

                    <p>
                        Temperature:
                        {weather.temperature}
                        {weather.unit}
                    </p>

                    <p>
                        Humidity:
                        {weather.humidity}%
                    </p>

                    <p>
                        Wind Speed:
                        {weather.wind} km/h
                    </p>

                </div>

            )}

        </div>

    );

}

export default App; 