import { useEffect, useState, type DependencyList } from 'react';

type State<T> = { data: T | undefined; error: Error | undefined; loading: boolean };

/**
 * Minimal async loader for data-layer calls. Pass deps that should trigger a
 * refetch (ids, store values that change server state).
 */
export function useData<T>(load: () => Promise<T>, deps: DependencyList): State<T> {
  const [state, setState] = useState<State<T>>({ data: undefined, error: undefined, loading: true });

  useEffect(() => {
    let live = true;
    load().then(
      (data) => live && setState({ data, error: undefined, loading: false }),
      (error: Error) => live && setState({ data: undefined, error, loading: false }),
    );
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
