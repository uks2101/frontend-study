import { useState } from 'react';

export function useMutation({ mutationFn, onSuccess, onError }) {
  const [state, setState] = useState({ isPending: false, error: null });

  async function mutate(variables, callbacks = {}) {
    setState({ isPending: true, error: null });

    try {
      const data = await mutationFn(variables);
      setState({ isPending: false, error: null });
      onSuccess?.(data, variables);
      callbacks.onSuccess?.(data, variables);
    } catch (error) {
      setState({ isPending: false, error });
      onError?.(error, variables);
      callbacks.onError?.(error, variables);
    }
  }

  return { mutate, ...state };
}