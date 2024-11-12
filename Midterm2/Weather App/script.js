const apiKey = "393b16a71e29e35583a6b742502b361a";
let isCelsius = true;

function fetchWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    fetchWeatherDataByCity(city);
    fetchForecast(city);
  } else {
    alert("Please enter a city name.");
  }
}

function fetchWeatherForCity(city) {
  document.getElementById("cityInput").value = city;
  fetchWeatherDataByCity(city);
  fetchForecast(city);
}

function fetchWeatherDataByCity(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  )
    .then((response) => response.json())
    .then((data) =>
      data.cod === 200
        ? displayCurrentWeather(data)
        : alert(`Error: ${data.message}`)
    )
    .catch((error) => console.error("Error fetching weather:", error));
}

function fetchForecast(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
  )
    .then((response) => response.json())
    .then((data) =>
      data.cod === "200"
        ? displayForecast(data.list)
        : console.error(`Forecast error: ${data.message}`)
    )
    .catch((error) => console.error("Error fetching forecast:", error));
}

function displayCurrentWeather(data) {
  document.getElementById("currentWeather").innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${formatTemperature(data.main.temp)}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Condition: ${data.weather[0].description}</p>
        <img src="https://openweathermap.org/img/wn/${
          data.weather[0].icon
        }.png" alt="weather icon">
    `;
}

function displayForecast(data) {
  const forecastCardsDiv = document.querySelector(".forecast-cards");
  forecastCardsDiv.innerHTML = data
    .slice(0, 5)
    .map(
      (day) => `
        <div class="forecast-item">
            <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
            <p>Temp: ${formatTemperature(day.main.temp)}</p>
            <p>${day.weather[0].description}</p>
            <img src="https://openweathermap.org/img/wn/${
              day.weather[0].icon
            }.png" alt="forecast icon">
        </div>
    `
    )
    .join("");
}

function toggleUnits() {
  isCelsius = document.getElementById("tempUnit").value === "C";
  const city = document.getElementById("cityInput").value.trim();
  if (city) fetchWeather();
}

function formatTemperature(temp) {
  return isCelsius ? `${temp} °C` : `${convertToFahrenheit(temp)} °F`;
}

function convertToFahrenheit(celsius) {
  return ((celsius * 9) / 5 + 32).toFixed(1);
}

function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoordinates(latitude, longitude);
    });
  } else {
    alert("Geolocation not supported by this browser.");
  }
}

function fetchWeatherByCoordinates(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => displayCurrentWeather(data))
    .catch((error) => console.error("Error fetching location weather:", error));
}
