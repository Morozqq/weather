const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/country", (req, res) => {
    res.sendFile(__dirname + "/country.html");
});

app.get("/chack", (req, res) => {
    res.sendFile(__dirname + "/faceit.html");
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

// Function to get country data by name
function getCountryData(countryName, res) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}`;

    // Make an HTTP GET request
    const req = https.get(apiUrl, (response) => {
        let data = "";

        response.on("data", (chunk) => {
            data += chunk;
        });

        response.on("end", () => {
            try {
                const countryData = JSON.parse(data)[0]; // Assuming the first result if there are multiple matches
                displayCountryData(res, countryData);
            } catch (error) {
                console.error("Error parsing country data:", error.message);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    });

    // Handle errors during the HTTP request
    req.on("error", (error) => {
        console.error("Error fetching country data:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    });

    req.end();
}

// Function to display country data
function displayCountryData(res, countryData) {
    console.log("Country Data:", countryData);
    res.json(countryData);
}

// Function to get Chuck Norris joke
function getChuckNorrisJoke(res) {
    const chuckNorrisUrl = "https://api.chucknorris.io/jokes/random";

    https.get(chuckNorrisUrl, function (response) {
        console.log(response.statusCode);

        response.on("data", function (data) {
            const jokeData = JSON.parse(data);
            res.json({ joke: jokeData.value });
        });
    });
}

// Route for Chuck Norris joke
app.get("/chucknorris", (req, res) => {
    getChuckNorrisJoke(res);
});

// Route for city weather
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

// Route for country data
app.post("/countrydata", (req, res) => {
    const countryName = req.body.countryName;
    getCountryData(countryName, res);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
