import { Link } from 'react-router-dom';
import { useTMDB } from '../../context/TmdbContext';
import './MovieCard.css';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
}

type Props = {
  movie: Movie;
  index: number;
}

function MovieCard({ movie, index }: Props) {
  const { toggleFavorite, isFavorite } = useTMDB();
  const year = movie.release_date?.split('-')[0] ?? '—';
  const rating = movie.vote_average.toFixed(1);
  const favorited = isFavorite(movie.id);

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="movie-card"
      style={{ '--delay': `${index * 35}ms` } as React.CSSProperties}
    >
      <div className="movie-card__poster">
        {movie.poster_path ? (
          <img
            className="movie-card__img"
            src={`${IMAGE_BASE}${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
          />
        ) : (
          <div className="movie-card__no-image">
            <span>{movie.title[0]}</span>
          </div>
        )}

        <div className="movie-card__overlay">
          <p className="movie-card__overview">{movie.overview}</p>
        </div>

        <div className="movie-card__badge">
          <span className="movie-card__star">★</span>
          {rating}
        </div>
      </div>

      <div className="movie-card__info">
        <h3 className="movie-card__title">{movie.title}</h3>
        <span className="movie-card__year">{year}</span>
        <button
          className={`movie-card__fav${favorited ? ' movie-card__fav--active' : ''}`}
          onClick={e => { e.preventDefault(); toggleFavorite(movie.id); }}
          aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          {favorited ? '♥ Retirer des favoris' : '♡ Ajouter aux favoris'}
        </button>
      </div>
    </Link>
  );
}

export default MovieCard;
