const timeEl = document.querySelector(".time");
const dateEl = document.querySelector(".date");
const place = document.querySelector(".place");
const searchButton = document.querySelector(".search");
const share = document.querySelector(".share-icon");
const search = document.querySelector('.search')
const currentWeatherItems = document.querySelector("#current-weather-items");
const weatherForecast = document.querySelector("#weather-forecast");
const currentDay = document.querySelector(".current-day");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
share.addEventListener("click", () => {
  let shareUrl = "https://twitter.com/intent/tweet?url";
  window.open(shareUrl, "_blank");
});
const API_KEY = "ded7b3eafab45703fdd17ecd37f253e1";
setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const am_pm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span class="am-pm">${am_pm}</span>`;

  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);
getWeatherData();
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });
  });
}
function showWeatherData(data) {
  let { humidity, pressure, wind_speed, sunrise, sunset } = data.current;

  place.innerHTML = data.timezone;

  currentWeatherItems.innerHTML = `<div class="weather-item">
  <p>humidity</p>
  <p>${humidity}%</p> 
</div>
<div class="weather-item">
  <p>Pressure</p>
  <p>${pressure}hPa</p>
</div>
<div class="weather-item">
  <p>Windspeed</p>
  <p>${wind_speed}m/s</p>
</div>
<div class="weather-item">
  <p>Sunrise</p>
  <p>${window.moment(sunrise * 1000).format("HH:mm a")}</p>
</div>
<div class="weather-item">
  <p>Sunset</p>
  <p>${window.moment(sunset * 1000).format("HH:mm a")}</p>
</div>`;

  let otherDayForecast = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentDay.innerHTML = ` 
      <img src="http://openweathermap.org/img/wn/${
        day.weather[0].icon
      }@2x.png" alt="weather icon" class="w-icon">
      <div class="day">
        <p class="days" id="sunday">${window
          .moment(day.dt * 1000)
          .format("ddd")}</p>
        <p class="day-temp">Day - ${day.temp.day}&#176c</p>
        <p class="night-temp">Night - ${day.temp.night}&#176c</p>
      </div>`;
    } else {
      otherDayForecast += `
     <div class="weather-forecast-item">
        <p class="days">${window.moment(day.dt * 1000).format("ddd")}</p>
        <img src="http://openweathermap.org/img/wn/${
          day.weather[0].icon
        }@2x.png" alt="weather icon" class="w-icon">
        <p class="day-temp">Day - ${day.temp.day}&#176c</p>
        <p class="night-temp">Night - ${day.temp.night}&#176c</p>
      </div>`;
    }
  });
  weatherForecast.innerHTML = otherDayForecast;
}
