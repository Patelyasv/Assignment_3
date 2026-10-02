const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());


// Home route
app.get("/", (req, res) => {
    res.send("Weather Backend is running!");
});


// Weather route
app.get("/weather", async (req, res) => {

    try {

        const city = req.query.city;

        if (!city) {
            return res.json({
                message: "Please enter city name"
            });
        }


        // Get latitude and longitude
        const locationResponse = await axios.get(
            "https://geocoding-api.open-meteo.com/v1/search",
            {
                params: {
                    name: city,
                    count: 1,
                    language: "en",
                    format: "json"
                }
            }
        );


        const locationData = locationResponse.data;


        if (!locationData.results) {
            return res.json({
                message: "City not found"
            });
        }


        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;


        // Get weather
        const weatherResponse = await axios.get(
            "https://api.open-meteo.com/v1/forecast",
            {
                params: {
                    latitude: latitude,
                    longitude: longitude,
                    current: "temperature_2m,relative_humidity_2m,wind_speed_10m"
                }
            }
        );


        const weatherData = weatherResponse.data;


        res.json({
            city: location.name,
            country: location.country,
            temperature: weatherData.current.temperature_2m,
            humidity: weatherData.current.relative_humidity_2m,
            wind: weatherData.current.wind_speed_10m,
            unit: weatherData.current_units.temperature_2m
        });


    } catch (error) {

        console.log("ERROR:", error.message);

        res.status(500).json({
            message: "Error getting weather"
        });

    }

});


app.listen(5000, () => {
    console.log("Backend running at http://localhost:5000");
});