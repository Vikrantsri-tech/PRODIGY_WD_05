const cityInput = document.getElementById("cityInput");

const searchBtn = document.getElementById("searchBtn");

const locationBtn = document.getElementById("locationBtn");

const weatherCard = document.getElementById("weatherCard");

const loading = document.getElementById("loading");

const errorBox = document.getElementById("error");


// ================= SEARCH CITY =================

searchBtn.addEventListener("click", function () {

    const city = cityInput.value.trim();

    if (city === "") {

        showError("Please enter a city name.");

        return;
    }

    searchCity(city);

});


// Search when Enter is pressed

cityInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        searchBtn.click();

    }

});


// ================= SEARCH CITY =================

async function searchCity(city) {

    showLoading();

    hideError();

    try {

        const url =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const response = await fetch(url);

        const data = await response.json();


        if (!data.results || data.results.length === 0) {

            throw new Error("City not found.");

        }


        const location = data.results[0];


        getWeather(
            location.latitude,
            location.longitude,
            location.name,
            location.country
        );

    }

    catch (error) {

        hideLoading();

        showError(
            "Unable to find this city. Please try another city."
        );

    }

}


// ================= GET WEATHER =================

async function getWeather(
    latitude,
    longitude,
    cityName,
    countryName
) {

    showLoading();

    hideError();


    try {

        const url =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,rain,weather_code,wind_speed_10m&daily=weather_code,sunrise,sunset&timezone=auto`;

        const response = await fetch(url);

        const data = await response.json();


        displayWeather(
            data,
            cityName,
            countryName
        );

    }

    catch (error) {

        showError(
            "Unable to fetch weather data."
        );

    }

    finally {

        hideLoading();

    }

}


// ================= DISPLAY WEATHER =================

function displayWeather(
    data,
    cityName,
    countryName
) {

    const current = data.current;

    const daily = data.daily;


    document.getElementById("cityName").textContent =
        cityName;


    document.getElementById("countryName").textContent =
        countryName;


    document.getElementById("temperature").textContent =
        Math.round(current.temperature_2m);


    document.getElementById("feelsLike").textContent =
        Math.round(current.apparent_temperature) + " °C";


    document.getElementById("humidity").textContent =
        current.relative_humidity_2m + " %";


    document.getElementById("windSpeed").textContent =
        current.wind_speed_10m + " km/h";


    document.getElementById("rain").textContent =
        current.rain + " mm";


    document.getElementById("weatherDescription").textContent =
        getWeatherDescription(current.weather_code);


    document.getElementById("weatherIcon").textContent =
        getWeatherIcon(current.weather_code);


    document.getElementById("sunrise").textContent =
        formatTime(daily.sunrise[0]);


    document.getElementById("sunset").textContent =
        formatTime(daily.sunset[0]);


    weatherCard.style.display = "block";

}


// ================= WEATHER DESCRIPTION =================

function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear Sky";
    }

    if (code === 1 || code === 2) {
        return "Partly Cloudy";
    }

    if (code === 3) {
        return "Cloudy";
    }

    if (
        code === 45 ||
        code === 48
    ) {
        return "Foggy";
    }

    if (
        code >= 51 &&
        code <= 57
    ) {
        return "Drizzle";
    }

    if (
        code >= 61 &&
        code <= 67
    ) {
        return "Rainy";
    }

    if (
        code >= 71 &&
        code <= 77
    ) {
        return "Snowy";
    }

    if (
        code >= 80 &&
        code <= 82
    ) {
        return "Rain Showers";
    }

    if (
        code >= 95 &&
        code <= 99
    ) {
        return "Thunderstorm";
    }

    return "Unknown Weather";

}


// ================= WEATHER ICON =================

function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    }

    if (code === 1 || code === 2) {
        return "🌤️";
    }

    if (code === 3) {
        return "☁️";
    }

    if (
        code === 45 ||
        code === 48
    ) {
        return "🌫️";
    }

    if (
        code >= 51 &&
        code <= 57
    ) {
        return "🌦️";
    }

    if (
        code >= 61 &&
        code <= 67
    ) {
        return "🌧️";
    }

    if (
        code >= 71 &&
        code <= 77
    ) {
        return "❄️";
    }

    if (
        code >= 80 &&
        code <= 82
    ) {
        return "🌦️";
    }

    if (
        code >= 95 &&
        code <= 99
    ) {
        return "⛈️";
    }

    return "🌤️";

}


// ================= USER LOCATION =================

locationBtn.addEventListener(
    "click",
    function () {

        if (!navigator.geolocation) {

            showError(
                "Geolocation is not supported by your browser."
            );

            return;
        }


        showLoading();

        hideError();


        navigator.geolocation.getCurrentPosition(

            function (position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                getWeather(
                    latitude,
                    longitude,
                    "Your Location",
                    ""
                );

            },

            function () {

                hideLoading();

                showError(
                    "Unable to access your location. Please allow location permission."
                );

            }

        );

    }
);


// ================= FORMAT TIME =================

function formatTime(time) {

    const date = new Date(time);

    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// ================= LOADING =================

function showLoading() {

    loading.style.display = "block";

    weatherCard.style.display = "none";

}

function hideLoading() {

    loading.style.display = "none";

}


// ================= ERROR =================

function showError(message) {

    errorBox.textContent = message;

    errorBox.style.display = "block";

}

function hideError() {

    errorBox.style.display = "none";

}


// ================= DEFAULT CITY =================

// Load weather for a default city
// when the website opens.

searchCity("Lucknow");
