const apiKey = "311540a6489cccc2a48785f086b3d254";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon")

var input = document.getElementById("myInput");


async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    }
    else {
        var data = await response.json();
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp * 10) / 10 + "&#8451;";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "&#37;";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
        document.querySelector(".desc").innerHTML = data.weather[0].main;
        
        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "images/clouds.png";
        } else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "images/clear.png";
        } else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "images/rain.png";
        } else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        } else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "images/mist.png";
        }
        
        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }

}

function handleButtonCLick() {
    checkWeather(searchBox.value);
}

searchBtn.addEventListener("click", handleButtonCLick);

searchBox.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        handleButtonCLick();
    }
});