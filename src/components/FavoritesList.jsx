import PropTypes from "prop-types";

const FavoritesList = ({
  favorites,
  searchFavoriteWeather,
  removeFromFavorites,
}) => {
  return (
    <div className="flex justify-center items-center flex-col text-2xl">
      <h3 className="font-extrabold m-4 text-4xl">💙 Favoris</h3>
      <ul className="flex flex-col items-center cursor-pointer">
        {favorites.map((favorite, index) => (
          <li key={index}>
            <button onClick={() => removeFromFavorites(favorite)}>❌</button>

            <span onClick={() => searchFavoriteWeather(favorite)}>
              {favorite}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

FavoritesList.propTypes = {
  favorites: PropTypes.array.isRequired,
  searchFavoriteWeather: PropTypes.func.isRequired,
  removeFromFavorites: PropTypes.func.isRequired,
};

export default FavoritesList;
