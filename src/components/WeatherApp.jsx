// react
import { useState } from "react";

const API_KEY = import.meta.env.VITE_SECRET_API_KEY;

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

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

  // vérifie que la ville recherchée n'est pas une string vide 
  const handleSearch = () => {
    if (city.trim() !== "") {
      fetchWeatherData();
    } else {
      setError("Veuillez entrer une ville valide.");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Entrez le nom de la ville"
      />
      <button onClick={handleSearch}>Rechercher</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weatherData && (
        <div>
          <h2>{weatherData.name}</h2>
          <p>Météo: {weatherData.weather[0].description}</p>
          <p>Température: {weatherData.main.temp}°C</p>
          <p>Ressenti: {weatherData.main.feels_like}°C</p>
          <p>Vent: {weatherData.wind.speed} km/h</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
