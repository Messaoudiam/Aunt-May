// react
import { useState } from "react";

const API_KEY = import.meta.env.VITE_SECRET_API_KEY;

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

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

  // ajoute la ville dans les favoris
  const addToFavorites = () => {
    if (weatherData && !favorites.includes(weatherData.name)) {
      setFavorites([...favorites, weatherData.name]);
    }
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

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div>
        <div className="flex items-center m-10">
          <input
            className="w-auto border border-gray-300 rounded-md py-2 px-4 mr-2 focus:outline-none focus:border-blue-500"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Entrez le nom de la ville"
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleSearch}
          >
            Rechercher
          </button>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {weatherData && (
        <div className="flex justify-center items-center flex-col">
          <h2>{weatherData.name}</h2>
          <p>Météo: {weatherData.weather[0].description}</p>
          <p>Température: {weatherData.main.temp}°C</p>
          <p>Ressenti: {weatherData.main.feels_like}°C</p>
          <p>Vent: {weatherData.wind.speed} km/h</p>
          <button
            className="text-2xl bg-blue-400 text-white px-4 py-2 shadow-md m-4"
            type="button"
            onClick={addToFavorites}
          >
            Ajouter aux favoris
          </button>
        </div>
      )}
      <h3>Favoris:</h3>
      <ul>
        {favorites.map((favorite, index) => (
          <li key={index} onClick={() => searchFavoriteWeather(favorite)}>
            {favorite}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeatherApp;
