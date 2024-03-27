document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "311540a6489cccc2a48785f086b3d254";
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

    const searchBox = document.querySelector(".search input");
    const searchBtn = document.querySelector(".search button");
    const weatherIcon = document.querySelector(".weather-icon");

    // Function to format local time
  // Function to format local time without seconds
function formatLocalTime(localTime) {
    const options = {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    };
    return localTime.toLocaleString('en-US', options);
}

    // Function to update weather icon based on weather condition
    function updateWeatherIcon(weatherMain) {
        switch (weatherMain) {
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
            case "Smoke":
            case "Haze":
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

    // Function to fetch weather data and update UI
    async function checkWeather(city) {
        try {
            const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
            if (!response.ok) {
                throw new Error('City not found');
            }

            const data = await response.json();
            const timezoneOffsetSeconds = data.timezone;

            // Update UI with weather data and local time
            updateWeatherUI(data, city, timezoneOffsetSeconds);

            // Update weather icon
            updateWeatherIcon(data.weather[0].main);

            document.querySelector(".weather").style.display = "block";
            document.querySelector(".error").style.display = "none";
        } catch (error) {
            console.error('Failed to fetch weather data:', error.message);
            document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
        }
    }

    // Function to update UI with weather data and local time
    function updateWeatherUI(data, city, timezoneOffsetSeconds) {
        // Format local time
        const currentTime = new Date();
        const timezoneOffset = currentTime.getTimezoneOffset() * 60 * 1000; // Convert minutes to milliseconds
        const adjustedTime = new Date(currentTime.getTime() + timezoneOffset + timezoneOffsetSeconds * 1000);

        // Format day, date, and time
        const formattedTime = formatLocalTime(adjustedTime);

        // Update UI with weather data and local time
        document.querySelector(".city").textContent = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "&#8451;";
        document.querySelector(".humidity").textContent = data.main.humidity + "%";
        document.querySelector(".wind").textContent = data.wind.speed + " m/s";
        document.querySelector(".desc").textContent = data.weather[0].description;
        document.querySelector(".local-time").textContent = `${formattedTime}`;

        // Update time every minute
        setInterval(() => {
            const currentTime = new Date();
            const adjustedTime = new Date(currentTime.getTime() + timezoneOffset + timezoneOffsetSeconds * 1000);
            const formattedTime = formatLocalTime(adjustedTime);
            document.querySelector(".local-time").textContent = `${formattedTime}`;
        }, 60000); // Update every minute
    }

    // Event listener for search button click
    function handleButtonClick() {
        checkWeather(searchBox.value);
    }

    // Event listener for Enter key press in search input
    searchBox.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            handleButtonClick();
        }
    });

    // Event listener for search button click
    searchBtn.addEventListener("click", handleButtonClick);
});
