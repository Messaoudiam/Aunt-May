import { useState, useEffect } from "react";
import FavoritesList from "./FavoritesList";
import axios from "axios";

const API_KEY = import.meta.env.VITE_SECRET_API_KEY;

const WeatherApp = () => {
  const [city, setCity] = useState("Lyon");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  const fetchWeatherDataByCity = async (cityName) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: cityName,
            appid: API_KEY,
            units: "metric",
          },
        }
      );
      setWeatherData(response.data);
      setError(null);
    } catch (error) {
      setError(
        "Une erreur s'est produite lors de la récupération des données météorologiques."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherDataByCoords = async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            lat: latitude,
            lon: longitude,
            appid: API_KEY,
            units: "metric",
          },
        }
      );
      setWeatherData(response.data);
      setError(null);
    } catch (error) {
      setError(
        "Une erreur s'est produite lors de la récupération des données météorologiques."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGeolocationSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherDataByCoords(latitude, longitude);
        },
        () => {
          setError(
            "Impossible de récupérer votre position. Veuillez activer la géolocalisation."
          );
        }
      );
    } else {
      setError("Votre navigateur ne supporte pas la géolocalisation.");
    }
  };

  const addToFavorites = () => {
    if (weatherData && !favorites.includes(weatherData.name)) {
      setFavorites([...favorites, weatherData.name]);
    }
  };

  const removeFromFavorites = (cityName) => {
    const updatedFavorites = favorites.filter((city) => city !== cityName);
    setFavorites(updatedFavorites);
  };

  const searchFavoriteWeather = (favoriteCity) => {
    setCity(favoriteCity);
    fetchWeatherDataByCity(favoriteCity);
  };

  const handleSearch = () => {
    if (city.trim() !== "") {
      fetchWeatherDataByCity(city);
    } else {
      setError("Veuillez entrer une ville valide.");
    }
  };

  useEffect(() => {
    fetchWeatherDataByCity(city);
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center m-10">
        <input
          className="w-auto border border-gray-300 rounded-md py-2 px-4 mr-2 focus:outline-none focus:border-sky-500"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Entrez le nom de la ville"
        />
        <button
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleSearch}
        >
          Rechercher
        </button>
        <button
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded ml-2"
          onClick={handleGeolocationSearch}
        >
          Utiliser la géolocalisation
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading && <p>Chargement des données météo...</p>}

      {weatherData && !loading && (
        <div className="flex flex-col gap-10 md:flex-row">
          <div className="flex justify-center items-center flex-col text-2xl bg-white rounded-lg shadow-md p-6 mx-auto">
            <h2 className="font-extrabold m-4 text-4xl">
              🏙️ {weatherData.name}
            </h2>
            <p>🌞 Météo: {weatherData.weather[0].description}</p>
            <p>🌡️ Température: {weatherData.main.temp.toFixed(0)}°C</p>
            <p>🍃 Vent: {weatherData.wind.speed.toFixed(0)} km/h</p>
            <button
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-4 py-2 shadow-md m-7 rounded"
              type="button"
              onClick={addToFavorites}
            >
              🩵 Ajouter aux favoris
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
            <FavoritesList
              favorites={favorites}
              searchFavoriteWeather={searchFavoriteWeather}
              removeFromFavorites={removeFromFavorites}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
