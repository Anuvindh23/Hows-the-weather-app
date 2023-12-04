import { useState } from "react";
import "../styles/weatherApp.scss";
import searchIcon from "../assets/search_icon.svg";

const WeatherApp = () => {
  const [weatherIcon, setWeatherIcon] = useState(
    "https://openweathermap.org/img/wn/02d@2x.png"
  );
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);
  let timeIntervalId;

  const updateLiveTime = (timestamp) => {
    const time = new Date(timestamp);
    let hours = time.getUTCHours();
    let minutes = time.getUTCMinutes();
    let seconds = time.getUTCSeconds();
    const extractedTime = hours + ":" + minutes + ":" + seconds;
    const liveTimeEl = document.getElementsByClassName("livetime");
    liveTimeEl[0].innerHTML = extractedTime;
  };

  const getWeatherData = async () => {
    setLoader(true);
    const cityName = document.getElementsByClassName("place-input")[0].value;
    const API_KEY = "1077a87a4edcc4df0c0e7ca012bf62ac";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
    const fetchResponse = await fetch(url);
    console.log(fetchResponse);
    if (fetchResponse.status === 200) {
      setLoader(false);
      const data = await fetchResponse.json();
      setWeatherData(data);
      const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
      setWeatherIcon(iconUrl);

      let timestamp = data.dt * 1000 + data.timezone * 1000;
      clearInterval(timeIntervalId);
      timeIntervalId = setInterval(function () {
        timestamp += 1000;
        updateLiveTime(timestamp);
      }, 1000);
    } else {
      setError(true);
      setTimeout(function () {
        setError(false);
      }, 8000);
    }
  };
  return (
    <>
      <div className={`card-container ${weatherData ? "data-received" : ""}`}>
        <div className="weather-img-container">
          <img src={weatherIcon} />
        </div>
        {weatherData && (
          <div className="weather-main-desc-container">
            <div className="main-container">
              <p>{weatherData.weather[0].main}</p>
            </div>
            <div className="desc-container">
              <p>{weatherData.weather[0].description}</p>
            </div>
          </div>
        )}
        <div className="search-container">
          <input className="place-input" placeholder="Enter city name"></input>
          <button onClick={getWeatherData} className="submit-btn">
            {loader ? (
              <span className="loader"></span>
            ) : (
              <img src={searchIcon} height={"30px"} />
            )}
          </button>
        </div>
        <div className={`search-results ${weatherData ? "inner-data" : ""}`}>
          {weatherData ? (
            <>
              <div className="data-field">
                <p>Location</p>
                <p className="place">
                  {weatherData.name}, {weatherData.sys.country}
                </p>
              </div>
              <div className="data-field">
                <p>Temperature</p>
                <p className="temperature">{weatherData.main.temp}°C</p>
              </div>
              <div className="data-field">
                <p>Humidity</p>
                <p className="humidity">{weatherData.main.humidity}%</p>
              </div>
              <div className="data-field">
                <p>Wind Speed</p>
                <p className="wind-speed">{weatherData.wind.speed} meter/sec</p>
              </div>
            </>
          ) : (
            <p>Get your city&apos;s weather results here</p>
          )}
        </div>
      </div>
      {weatherData && (
        <div className="time-container">
          <p className="livetime">00:00:00</p>
        </div>
      )}
      <div className={`error-container ${error ? "show-error" : ""}`}>
        <p>
          Oops! Looks like the city you entered is not available. Please check
          the spelling of the city you entered is correct.
        </p>
      </div>
    </>
  );
};

export default WeatherApp;
