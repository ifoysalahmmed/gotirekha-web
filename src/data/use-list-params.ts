import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

const LAST_PAGE = 1_000_000;

interface SetOptions {
  replace?: boolean;
}

export interface ListParams<K extends string> {
  page: number;
  values: Record<K, string | null>;
  filtered: boolean;
  setPage: (page: number) => void;
  setValue: (key: K, value: string | null, options?: SetOptions) => void;
  clear: () => void;
}

const readPage = (params: URLSearchParams): number => {
  const value = Number(params.get('page'));

  return Number.isInteger(value) && value >= 1 && value <= LAST_PAGE
    ? value
    : 1;
};

export const useListParams = <K extends string>(
  keys: readonly K[],
): ListParams<K> => {
  const [params, setParams] = useSearchParams();

  const values = Object.fromEntries(
    keys.map((key) => [key, params.get(key)]),
  ) as Record<K, string | null>;

  const setPage = useCallback(
    (next: number) => {
      setParams((current) => {
        const updated = new URLSearchParams(current);

        if (next <= 1) {
          updated.delete('page');
        } else {
          updated.set('page', String(next));
        }

        return updated;
      });
    },
    [setParams],
  );

  const setValue = useCallback(
    (key: K, value: string | null, options: SetOptions = {}) => {
      setParams(
        (current) => {
          const updated = new URLSearchParams(current);

          if (value === null || value === '') {
            updated.delete(key);
          } else {
            updated.set(key, value);
          }

          updated.delete('page');

          return updated;
        },
        {
          replace: options.replace ?? false,
        },
      );
    },
    [setParams],
  );

  const clear = useCallback(() => {
    setParams((current) => {
      const updated = new URLSearchParams(current);

      keys.forEach((key) => {
        updated.delete(key);
      });
      updated.delete('page');

      return updated;
    });
  }, [keys, setParams]);

  return {
    page: readPage(params),
    values,
    filtered: keys.some((key) => params.has(key)),
    setPage,
    setValue,
    clear,
  };
};
