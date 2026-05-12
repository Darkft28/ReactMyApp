import React, { createContext, useContext, useState, useEffect } from "react";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
}

type TmdbContextValue = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

const TmdbContext = createContext<TmdbContextValue | undefined>(undefined);

export const useTMDB = (): TmdbContextValue => {
  const ctx = useContext(TmdbContext);
  if (!ctx) throw new Error("useTMDB must be used inside TmdbProvider");
  return ctx;
};

export const TmdbProvider = ({ children }: { children: React.ReactNode }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("tmdb_favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tmdb_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.some(f => f === id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: number) => favorites.some(f => f === id);

  const value: TmdbContextValue = {
    movies,
    setMovies,
    page,
    setPage,
    favorites,
    toggleFavorite,
    isFavorite,
  };

  return <TmdbContext.Provider value={value}>{children}</TmdbContext.Provider>;
};
