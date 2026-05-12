import { useState, useEffect, useRef } from 'react';
import MovieCard from '../../components/MovieCard/MovieCard';
import { Input } from '../../components/ui/input';
import { useTMDB } from '../../context/TmdbContext';
import './Home.css';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
}

function buildPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '…', total];
  }
  if (current >= total - 3) {
    return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, '…', current - 1, current, current + 1, '…', total];
}

function Home() {
  const { movies, setMovies, page, setPage } = useTMDB();
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      setActiveQuery(value.trim());
    }, 400);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    setError(null);

    const fetchMovies = async () => {
      try {
        const url = activeQuery
          ? `${BASE_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&page=${page}&include_adult=true&query=${encodeURIComponent(activeQuery)}`
          : `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=fr-FR&page=${page}&sort_by=popularity.desc&include_adult=true`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur ${response.status}`);
        const data = await response.json();
        setMovies(data.results);
        setTotalPages(Math.min(data.total_pages, 100));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page, activeQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleClear = () => {
    handleQueryChange('');
  };

  const pageNumbers = buildPageNumbers(page, totalPages);

  const title = activeQuery ? `Résultats pour « ${activeQuery} »` : 'Films populaires';

  return (
    <main className="home">
      <div className="home__heading">
        <h1 className="home__title">{title}</h1>
        <span className="home__meta">p.{page}/{totalPages}</span>
      </div>

      <form className="search-bar" onSubmit={handleSearch} role="search">
        <Input
          type="search"
          placeholder="Rechercher un film…"
          value={query}
          onChange={e => handleQueryChange(e.target.value)}
          aria-label="Rechercher un film"
          className="search-bar__input"
        />
        {activeQuery && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={handleClear}
            aria-label="Effacer la recherche"
          >
            ✕
          </button>
        )}
      </form>

      {error && (
        <div className="home__error">
          <p>Impossible de charger les films — {error}</p>
          <p className="home__error-hint">Vérifiez votre clé API dans le fichier <code>.env</code></p>
        </div>
      )}

      {!loading && movies.length === 0 && !error && (
        <p className="home__empty">Aucun résultat pour « {activeQuery} »</p>
      )}

      {loading ? (
        <div className="home__grid">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="movie-skeleton" />
          ))}
        </div>
      ) : (
        <div className="home__grid">
          {movies.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="pagination" aria-label="Navigation des pages">
          <button
            className="pagination__btn pagination__arrow"
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
            aria-label="Page précédente"
          >
            ←
          </button>

          {pageNumbers.map((num, i) =>
            num === '…' ? (
              <span key={`ellipsis-${i}`} className="pagination__ellipsis">···</span>
            ) : (
              <button
                key={num}
                className={`pagination__btn${num === page ? ' pagination__btn--active' : ''}`}
                onClick={() => setPage(num as number)}
              >
                {num}
              </button>
            )
          )}

          <button
            className="pagination__btn pagination__arrow"
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages}
            aria-label="Page suivante"
          >
            →
          </button>
        </nav>
      )}
    </main>
  );
}

export default Home;
