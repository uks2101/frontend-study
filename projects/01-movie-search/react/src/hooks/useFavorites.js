import { useState } from 'react';
import { getFavorites, saveFavorites } from '../utils/favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => getFavorites());

  function toggleFavorite(movie) {
    const exists = favorites.some(fav => fav.id === movie.id);
    const updated = exists ? favorites.filter(fav => fav.id !== movie.id) : [...favorites, movie];

    setFavorites(updated);
    saveFavorites(updated);
  }

  function isFavorite(id) {
    return favorites.some(fav => fav.id === id);
  }

  return { favorites, toggleFavorite, isFavorite }
}