import { useState, useEffect } from 'react';
import { getProducts } from '../api/products';

const LOADING = { status: 'loading', data: null, error: null };

export function useProducts() {
  const [state, setState] = useState(LOADING);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    getProducts().then((data) => setState({ status: 'success', data, error: null })).catch((error) => setState({ status: 'error', data: null, error }));
  }, [reloadKey]);

  function refetch() {
    setState(LOADING);
    setReloadKey((key) => key + 1);
  }

  return { ...state, refetch };
}