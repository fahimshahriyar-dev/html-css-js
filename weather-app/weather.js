const input = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const place = document.getElementById("location");
const time = document.getElementById("datetime");
const temp = document.getElementById("temperature");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const windDirection = document.getElementById("windDirection");
const visibility = document.getElementById("visibility");
const weatherIcon = document.getElementById("weatherIcon");

const weatherIcons = {
    sunny: "☀️",
    clear: "🌙",
    "partly cloudy": "⛅",
    cloudy: "☁️",
    overcast: "☁️",
    mist: "🌫️",
    fog: "🌫️",
    rain: "🌧️",
    snow: "❄️",
    thunderstorm: "⛈️",
    drizzle: "🌦️",
};

function getWeatherIcon(condition) {
    const conditionLower = condition.toLowerCase();
    for (const [key, icon] of Object.entries(weatherIcons)) {
        if (conditionLower.includes(key)) {
            return icon;
        }
    }
    return "🌤️";
}

const getData = async (query) => {
    const info = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=7c2c1f83c5154458939182557250506&q=${query}&aqi=yes`
    );
    return await info.json();
};

const displayWeatherData = async (result) => {
    place.innerText = `${result.location.name}, ${result.location.country}`;
    time.innerText = result.location.localtime;
    temp.innerText = result.current.temp_c;
    feelsLike.innerText = `${result.current.feelslike_c}°C`;
    humidity.innerText = `${result.current.humidity}%`;
    windSpeed.innerText = `${result.current.wind_kph}km/h`;
    windDirection.innerText = `${result.current.wind_dir}`;
    visibility.innerText = `${result.current.vis_km}km`;
    weatherIcon.textContent = getWeatherIcon(result.current.condition.text);

    document.getElementById("weatherInfo").classList.add("show");
};

const getLocation = async (position) => {
    const result = await getData(
        `${position.coords.latitude},${position.coords.longitude}`
    );
    displayWeatherData(result);
};

const getLocationError = () => {
    console.log("location didn't find");
};

searchBtn.addEventListener("click", async () => {
    const value = input.value;
    if (value) {
        const result = await getData(value);
        displayWeatherData(result);
    }
});

// Load current location weather on page load
window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getLocation, getLocationError);
    } else {
        console.log("Location is not supported by this browser.");
    }
});

