import { Link } from 'react-router-dom';

import { useTMDB } from '../../context/TmdbContext';
import MovieCard from '../../components/MovieCard/MovieCard';
import './Favorites.css';

function Favorites() {
  const { movies, favorites } = useTMDB();

  const favoriteMovies = movies.filter(m => favorites.includes(m.id));

  return (
    <main className="favorites">
      <div className="favorites__heading">
        <h1 className="favorites__title">Mes favoris</h1>
        <span className="favorites__count">
          {favorites.length} film{favorites.length !== 1 ? 's' : ''}
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="favorites__empty">
          <p>Vous n'avez pas encore de favoris.</p>
          <Link to="/" className="favorites__link">Parcourir les films</Link>
        </div>
      ) : favoriteMovies.length === 0 ? (
        <div className="favorites__empty">
          <p>Vos favoris ne sont pas chargés sur cette page.</p>
          <Link to="/" className="favorites__link">Retour à l'accueil pour les afficher</Link>
        </div>
      ) : (
        <div className="favorites__grid">
          {favoriteMovies.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>
      )}
    </main>
  );
}

export default Favorites;
