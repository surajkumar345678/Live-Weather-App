require('dotenv').config();
const apiKey = process.env.API_KEY;
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

// Include the currentTime function
function currentTime(timezoneInSec, dtIn) {
    let utcTime = new Date(dtIn * 1000);  
    let localTime = new Date(utcTime.getTime() + timezoneInSec * 1000);

    let hour = localTime.getHours() % 12;
    let ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12 || 12;  

    let minutes = localTime.getMinutes();
    let weekday = localTime.toLocaleString('default', { weekday: 'long' });
    let month = localTime.toLocaleString('default', { month: 'short' });
    let date = localTime.getDate();

    return `${hour} : ${minutes} ${ampm} - ${weekday}, ${month} ${date}`;
}

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        var data = await response.json();
        const timezoneOffsetSeconds = data.timezone;

        // Uncomment the next line if you want to use the currentTime function
        // const localTime = currentTime(timezoneOffsetSeconds, data.dt);

        // Uncomment the next line if you want to display local time
        // document.querySelector(".local-time").innerHTML = localTime;

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp * 10) / 10 + "&#8451;";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "&#37;";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
        document.querySelector(".desc").innerHTML = data.weather[0].main;

        // Update the weather icon based on the description
        updateWeatherIcon(data.weather[0].main);

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
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
