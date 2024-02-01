const apiKey = "311540a6489cccc2a48785f086b3d254";
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?";
// const airPollutionApiUrl = "http://api.openweathermap.org/data/2.5/air_pollution?";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

// Include the currentTime function
// function currentTime(timezoneInSec, dtIn) {
//     let utcTime = new Date(dtIn * 1000);
//     let localTime = new Date(utcTime.getTime() + timezoneInSec * 1000);

//     let hour = localTime.getHours() % 12;
//     let ampm = hour >= 12 ? 'pm' : 'am';
//     hour = hour % 12 || 12;

//     let minutes = localTime.getMinutes();
//     let weekday = localTime.toLocaleString('default', { weekday: 'long' });
//     let month = localTime.toLocaleString('default', { month: 'short' });
//     let date = localTime.getDate();

//     return `${hour} : ${minutes} ${ampm} - ${weekday}, ${month} ${date}`;
// }

async function getCoordinates(city) {
    try {
        const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
        const response = await fetch(geocodingApiUrl);
        const data = await response.json();

        if (data.length > 0) {
            const { lat, lon } = data[0];
            return { lat, lon };
        } else {
            throw new Error("City not found");
        }
    } catch (error) {
        throw new Error("Error fetching coordinates:", error);
    }
}

async function checkWeather(city) {
    try {
        const { lat, lon } = await getCoordinates(city);

        const weatherResponse = await fetch(`${weatherApiUrl}lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
        const weatherData = await weatherResponse.json();

        // Uncomment the next line if you want to use the currentTime function
        // const localTime = currentTime(weatherData.timezone, weatherData.dt);

        // Uncomment the next line if you want to display local time
        // document.querySelector(".local-time").innerHTML = localTime;

        document.querySelector(".city").innerHTML = weatherData.name;
        document.querySelector(".temp").innerHTML = Math.round(weatherData.main.temp * 10) / 10 + "&#8451;";
        document.querySelector(".humidity").innerHTML = weatherData.main.humidity + "&#37;";
        document.querySelector(".wind").innerHTML = weatherData.wind.speed + " km/h";
        // document.querySelector(".aqi").innerHTML = "N/A";
        document.querySelector(".desc").innerHTML = weatherData.weather[0].main;

        // Update the weather icon based on the description
        updateWeatherIcon(weatherData.weather[0].main);

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";

    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    }
}

function updateWeatherIcon(main) {
    switch (main) {
        case "Thunderstorm":
            weatherIcon.src = "animated/thunder.svg";
            break;
        case "Drizzle":
            weatherIcon.src = "animated/rainy-5.svg";
            break;
        case "Rain":
            weatherIcon.src = "animated/rainy-6.svg";
            break;
        case "Snow":
            weatherIcon.src = "animated/snowy-6.svg";
            break;
        case "Mist":
            weatherIcon.src = "animated/snowy-5.svg";
            break;
        case "Smoke":
            weatherIcon.src = "animated/snowy-3.svg";
            break;
        case "Haze":
            weatherIcon.src = "animated/snowy-4.svg";
            break;
        case "Fog":
            weatherIcon.src = "animated/snowy-5.svg";
            break;
        case "Clear":
            weatherIcon.src = "animated/day.svg";
            break;
        case "Clouds":
            weatherIcon.src = "animated/cloudy.svg";
            break;
        default:
            weatherIcon.src = "animated/night.svg";
            break;
    }
}

function handleButtonClick() {
    checkWeather(searchBox.value);
}

searchBtn.addEventListener("click", handleButtonClick);

searchBox.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        handleButtonClick();
    }
});
