const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Function to get weather data by city
function getWeatherByCity(city, res) {
    const url =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&appid=794f6646c3546306ac4be1843ed38e2a&units=metric";
    https.get(url, function (response) {
        console.log(response.statusCode);

        response.on("data", function (data) {
            const weatherdata = JSON.parse(data);
            displayWeatherData(res, weatherdata);
        });
    });
}

// Function to get weather data by latitude and longitude
function getWeatherByLatLon(lat, lon, res) {
    const url =
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=794f6646c3546306ac4be1843ed38e2a&units=metric";

    https.get(url, function (response) {
        console.log(response.statusCode);
        response.on("data", function (data) {
            const weatherdata = JSON.parse(data);
            displayWeatherData(res, weatherdata);
        });
    });
}

// Function to display weather data
function displayWeatherData(res, weatherdata) {
    const city = weatherdata.name;
    const temp = weatherdata.main.temp;
    const feelsLike = weatherdata.main.feels_like;
    const description = weatherdata.weather[0].description;
    const icon = weatherdata.weather[0].icon;
    const imgURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    const coordinates = weatherdata.coord;
    const humidity = weatherdata.main.humidity;
    const pressure = weatherdata.main.pressure;
    const windSpeed = weatherdata.wind.speed;
    const countryCode = weatherdata.sys.country;
    const rainVolume = weatherdata.rain ? weatherdata.rain["3h"] || 0 : 0;

    // Send a JSON response
    res.json({
        temperature: temp,
        description: description,
        iconURL: imgURL,
        city: city,
        feelsLike: feelsLike,
        coordinates: coordinates,
        humidity: humidity,
        pressure: pressure,
        windSpeed: windSpeed,
        countryCode: countryCode,
        rainVolume: rainVolume,
    });
}

// Routte for city weather
app.post("/weather", (req, res) => {
    const city = req.body.city;
    getWeatherByCity(city, res);
});

// Route for latitude and longitude weather
app.post("/latlon", (req, res) => {
    const lat = req.body.lat;
    const lon = req.body.lon;
    getWeatherByLatLon(lat, lon, res);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
