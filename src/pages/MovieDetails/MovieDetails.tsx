import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useTMDB } from '../../context/TmdbContext';
import MovieCard from '../../components/MovieCard/MovieCard';
import './MovieDetails.css';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';

type MovieDetail = {
  id: number;
  title: string;
  original_language: string;
  tagline: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
}

type SimilarMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
}

type Review = {
  id: string;
  author: string;
  content: string;
  created_at: string;
}

const LANG_NAMES = new Intl.DisplayNames(['fr'], { type: 'language' });

function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const { toggleFavorite, isFavorite } = useTMDB();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [similar, setSimilar] = useState<SimilarMovie[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    setNotFound(false);

    const fetchAll = async () => {
      try {
        const [detailRes, similarRes, reviewsRes] = await Promise.all([
          fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=fr-FR`),
          fetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=fr-FR`),
          fetch(`${BASE_URL}/movie/${id}/reviews?api_key=${API_KEY}`),
        ]);

        if (detailRes.status === 404) {
          setNotFound(true);
          return;
        }
        if (!detailRes.ok) throw new Error(`Erreur ${detailRes.status}`);

        const [detail, sim, rev] = await Promise.all([
          detailRes.json(),
          similarRes.json(),
          reviewsRes.json(),
        ]);

        setMovie(detail);
        setSimilar(sim.results.slice(0, 6));
        setReviews(rev.results.slice(0, 5));
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  if (notFound) return <Navigate to="/404" replace />;

  if (loading) {
    return (
      <main className="details">
        <div className="details__skeleton-backdrop" />
        <div className="details__skeleton-body">
          <div className="details__skeleton-poster" />
          <div className="details__skeleton-info">
            <div className="details__skeleton-line details__skeleton-line--title" />
            <div className="details__skeleton-line" />
            <div className="details__skeleton-line" />
          </div>
        </div>
      </main>
    );
  }

  if (!movie) return null;

  const favorited = isFavorite(movie.id);
  const year = movie.release_date?.split('-')[0] ?? '—';
  const lang = (() => { try { return LANG_NAMES.of(movie.original_language) ?? movie.original_language; } catch { return movie.original_language; } })();

  return (
    <main className="details">
      {movie.backdrop_path && (
        <div
          className="details__backdrop"
          style={{ backgroundImage: `url(${BACKDROP_BASE}${movie.backdrop_path})` }}
        />
      )}

      <div className="details__content">
        <div className="details__hero">
          <div className="details__poster-wrap">
            {movie.poster_path ? (
              <img
                className="details__poster"
                src={`${IMAGE_BASE}${movie.poster_path}`}
                alt={movie.title}
              />
            ) : (
              <div className="details__poster-placeholder">
                <span>{movie.title[0]}</span>
              </div>
            )}
          </div>

          <div className="details__meta">
            <Link to="/" className="details__back">← Retour</Link>

            <h1 className="details__title">{movie.title}</h1>

            {movie.tagline && (
              <p className="details__tagline">« {movie.tagline} »</p>
            )}

            <div className="details__chips">
              <span className="details__chip">{year}</span>
              <span className="details__chip">{lang}</span>
              {movie.runtime > 0 && (
                <span className="details__chip">{Math.floor(movie.runtime / 60)}h{String(movie.runtime % 60).padStart(2, '0')}</span>
              )}
              <span className="details__chip details__chip--rating">★ {movie.vote_average.toFixed(1)}</span>
            </div>

            {movie.genres.length > 0 && (
              <div className="details__genres">
                {movie.genres.map(g => (
                  <span key={g.id} className="details__genre">{g.name}</span>
                ))}
              </div>
            )}

            {movie.overview && (
              <p className="details__overview">{movie.overview}</p>
            )}

            <button
              className={`details__fav${favorited ? ' details__fav--active' : ''}`}
              onClick={() => toggleFavorite(movie.id)}
            >
              {favorited ? '♥ Retirer des favoris' : '♡ Ajouter aux favoris'}
            </button>
          </div>
        </div>

        {similar.length > 0 && (
          <section className="details__section">
            <h2 className="details__section-title">Films similaires</h2>
            <div className="details__grid">
              {similar.map((m, i) => (
                <MovieCard key={m.id} movie={m} index={i} />
              ))}
            </div>
          </section>
        )}

        {reviews.length > 0 && (
          <section className="details__section">
            <h2 className="details__section-title">Avis</h2>
            <div className="details__reviews">
              {reviews.map(r => (
                <article key={r.id} className="review">
                  <div className="review__header">
                    <span className="review__author">{r.author}</span>
                    <span className="review__date">
                      {new Date(r.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="review__content">{r.content}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default MovieDetails;
