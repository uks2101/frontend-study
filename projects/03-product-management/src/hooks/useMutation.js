import { useState } from 'react';

export function useMutation({ mutationFn, onMutate, onSuccess, onError, onSettled }) {
  const [state, setState] = useState({ isPending: false, error: null });

  async function mutate(variables, callbacks = {}) {
    setState({ isPending: true, error: null });

    const context = onMutate?.(variables);

    try {
      const data = await mutationFn(variables);
      setState({ isPending: false, error: null });
      onSuccess?.(data, variables, context);
      callbacks.onSuccess?.(data, variables, context);
    } catch (error) {
      setState({ isPending: false, error });
      onError?.(error, variables, context);
      callbacks.onError?.(error, variables, context);
    } finally {
      onSettled?.(variables, context);
    }
  }

  return { mutate, ...state };
}