import { useEffect, useState } from "react";

export function useMoviesFetch(inptSearch, KEY) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function handleMoviesFetch() {
      try {
        setError("");
        setIsLoading(true);
        const res = await fetch(
          `https://omdbapi.com/?apikey=${KEY}&s=${inptSearch}`,
          {
            signal: controller.signal,
          }
        );
        if (!res.ok) throw new Error("something went wrong!");
        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found!");
        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          console.log(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (inptSearch.length < 2) {
      setMovies([]);
      setError("");
      return;
    }
    // handleClose();
    handleMoviesFetch();
    return function () {
      controller.abort();
    };
  }, [inptSearch]);

  return { movies, isLoading, error };
}
