// src/hooks/useFetch.ts
import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3000/api";
const AUTH_STORAGE_KEY = "gp_auth";

type UseFetchOptions = RequestInit & {
  skip?: boolean;
};

function getAuthHeader() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as {
      accessToken?: string;
    };
    if (!parsed.accessToken) return {};
    return {
      Authorization: `Bearer ${parsed.accessToken}`,
    };
  } catch {
    return {};
  }
}

export function useFetch<T = unknown>(
  path: string,
  options: UseFetchOptions = {}
) {
  const { skip, ...fetchOptions } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<Error | null>(null);

  const url = `${API_BASE_URL}${path}`;

  async function fetchData() {
    setLoading(true);
    setError(null);

      try {
      // create a Headers instance from any provided headers and ensure typing is correct
      const { headers: optHeaders, ...restOptions } = fetchOptions;
      const headers = new Headers(optHeaders as HeadersInit | undefined);

      // ensure content-type is set and merge auth header entries
      headers.set("Content-Type", "application/json");
      const authHeader = getAuthHeader();
      Object.entries(authHeader).forEach(([key, value]) => {
        if (value != null) headers.set(key, String(value));
      });

      const res = await fetch(url, {
        // plus besoin de credentials: "include" si tu utilises uniquement Bearer
        headers,
        ...restOptions,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = (await res.json()) as T;
      setData(json);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!skip) {
      fetchData();
    }
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}
