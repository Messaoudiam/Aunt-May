// react
import { useState, useEffect } from "react";

// components
import FavoritesList from "./FavoritesList";

const API_KEY = import.meta.env.VITE_SECRET_API_KEY;

const WeatherApp = () => {
  const [city, setCity] = useState("Lyon");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  // récupération des datas du fetch
  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      if (response.ok) {
        setWeatherData(data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(
        "Une erreur s'est produite lors de la récupération des données météorologiques."
      );
    }
  };

  // "Lyon" est la ville recherchée par défaut
  useEffect(() => {
    fetchWeatherData();
  }, []);

  // ajoute la ville dans les favoris
  const addToFavorites = () => {
    if (weatherData && !favorites.includes(weatherData.name)) {
      setFavorites([...favorites, weatherData.name]);
    }
  };

  // supprime la ville des favoris
  const removeFromFavorites = (cityName) => {
    const updatedFavorites = favorites.filter((city) => city !== cityName);
    setFavorites(updatedFavorites);
  };

  // recherche et fetch la ville favorite sélectionnée
  const searchFavoriteWeather = (favoriteCity) => {
    setCity(favoriteCity);
    fetchWeatherData(favoriteCity);
  };

  // vérifie que la ville recherchée n'est pas une string vide
  const handleSearch = () => {
    if (city.trim() !== "") {
      fetchWeatherData();
    } else {
      setError("Veuillez entrer une ville valide.");
    }
  };

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
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weatherData && (
        <div className="flex gap-10">
          <div className="flex justify-center items-center flex-col text-2xl bg-white rounded-lg shadow-md p-6 mx-auto">
            <h2 className="font-extrabold m-4 text-4xl">
              🏙️ {weatherData.name}
            </h2>
            <p>🌞 Météo: {weatherData.weather[0].description}</p>
            {/* "toFixed()" pour arrondir la température */}
            <p>🌡️ Température: {weatherData.main.temp.toFixed(0)}°C</p>
            {/* "toFixed()" pour arrondir la vitesse */}
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
