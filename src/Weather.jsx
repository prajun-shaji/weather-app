import { Air, Search, Water } from "@mui/icons-material";
import React, { useState, useEffect } from "react";

const d1 = "../public/images/01d.png";
const n1 = "../public/images/01n.png";
const d2 = "../public/images/02d.png";
const n2 = "../public/images/02n.png";
const d3 = "../public/images/03d.png";
const n3 = "../public/images/03n.png";
const d4 = "../public/images/04d.png";
const n4 = "../public/images/04n.png";
const d9 = "../public/images/09d.png";
const d10 = "../public/images/10d.png";
const d11 = "../public/images/11d.png";
const d13 = "../public/images/13d.png";
const d50 = "../public/images/50d.png";
const unknown = "../public/images/unknown.png";

const Weather = () => {
  const year = new Date().getFullYear();
  const API_KEY = "9ec4290b2ae6c8e3dad7420557045ca9";

  const [searchInput, setSearchInput] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState(d1);
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  const weatherIcons = {
    "01d": d1,
    "01n": n1,
    "02d": d2,
    "02n": n2,
    "03d": d3,
    "03n": n3,
    "04d": d4,
    "04n": n4,
    "09d": d9,
    "09n": d9,
    "10d": d10,
    "10n": d10,
    "11d": d11,
    "11n": d11,
    "13d": d13,
    "13n": d13,
    "50d": d50,
    "50n": d50,
  };

  const defaultIcon = unknown;

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setWeatherData(data);
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getCurrentLocation = () => {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          setError("Failed to get current location. Please try again.");
          setLoading(false);
        }
      );
    };

    getCurrentLocation();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      setCurrentDate(date.toLocaleDateString());
      setCurrentTime(date.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (searchInput === "") {
      setError("Please enter a city name.");
      setLoading(false);
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        searchInput
      )}&units=metric&appid=${API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setWeatherData(data);

      const iconCode = data.weather[0].icon;
      setWeatherIcon(weatherIcons[iconCode] || defaultIcon);
    } catch (error) {
      setWeatherIcon(unknown);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="flex justify-center mb-10">
        <form className="flex items-center justify-between bg-white shadow-lg rounded-lg w-4/5 min-w-[300px] p-3">
          <input
            className="bg-white w-full h-full p-2 focus:outline-none"
            type="text"
            placeholder="Search City"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            type="submit"
            onClick={handleSearch}
            className="bg-white cursor-pointer"
          >
            <Search />
          </button>
        </form>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        weatherData && (
          <div className="flex justify-center items-center font-medium text-lg">
            <img
              className="w-2/5 h-2/5 md:w-[150px] md:h-[150px]"
              src={weatherIcon}
              alt="Weather Icon"
            />
            <div className="mx-4 ">
              {Math.floor(weatherData.main.temp)}&deg;C
            </div>
            <h1>{weatherData.name}</h1>
          </div>
        )
      )}
      <div className="text-center mt-4">
        <p className="text-lg font-medium">{currentDate}</p>
        <p className="text-lg font-medium">{currentTime}</p>
      </div>
      {weatherData && (
        <div className=" text-lg font-medium flex items-center justify-between absolute bottom-10 pb-5 gap-10 w-full">
          <div className="flex items-center flex-col md:flex-row">
            <div className="my-5 mx-0 md:my-1 md:mx-5">
              <Water />
              <div>{weatherData.main.humidity}%</div>
              <div>HUMIDITY</div>
            </div>
          </div>
          <div className="flex items-center flex-col md:flex-row">
            <div className="my-5 mx-0 md:my-1 md:mx-5">
              <Air />
              <div>{weatherData.wind.speed}KMPH</div>
              <div>WIND SPEED</div>
            </div>
          </div>
        </div>
      )}
      <p className="absolute bottom-0 text-center text-gray-400 w-full">
        Copyright © {year}
      </p>
    </div>
  );
};

export default Weather;
