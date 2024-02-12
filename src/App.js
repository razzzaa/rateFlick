import { useEffect, useRef, useState } from "react";
import StarRating from "./starRating";
import TrailerModal from "./TrailerModal";
import { useMoviesFetch } from "./useMoviesFetch";
import { useLocalStorage } from "./useLocalStorage";

const TRAILERKEY = "9de0616d717374f9f382940f3ebb922d";
const KEY = "86195a89";

const topFive = [
  {
    imdbID: "tt0111161",
    title: "The Shawshank Redemption",
    imdbRating: "9.3",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg",
  },
  {
    imdbID: "tt23849204",
    title: "12th Fail",
    imdbRating: "9.2",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BOTJlY2U2ZmYtMzU3Ny00ZDI3LWEwMDYtOWIxNzdhZDI5ZWRkXkEyXkFqcGdeQXVyMTY3ODkyNDkz._V1_SX300.jpg",
  },
  {
    imdbID: "tt0068646",
    title: "The Godfather",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    imdbRating: "9.2",
  },
  {
    imdbID: "tt0468569",
    title: "The Dark Knight",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
    imdbRating: "9.0",
  },
  {
    imdbID: "tt0108052",
    title: "Schindler's List",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    imdbRating: "9.0",
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [inptSearch, setInptSearch] = useState("");
  const [background, setBackground] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [movieTrailer, setMovieTrailer] = useState("");
  const [trailerOpen, setTrailerOpen] = useState(false);
  const { movies, isLoading, error } = useMoviesFetch(inptSearch, KEY);
  const [watched, setWatched] = useLocalStorage([], "movies");
  console.log(watched);
  console.log(selectedId);

  function handleSearch(e) {
    setInptSearch(e);
  }

  function handleClose() {
    setSelectedId(null);
    setBackground("");
    setMovieTrailer("");
    setTrailerOpen(false);
  }

  function handleWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDelete(id) {
    setWatched((movie) => movie.filter((movie) => movie.imdbID !== id));
  }

  function handleSelectIdBackground(id, poster) {
    setTrailerOpen(false);
    setSelectedId((selectedId) => (selectedId === id ? null : id));
    setBackground((background) =>
      background === poster.replace("SX300", "M")
        ? ""
        : poster.replace("SX300", "M")
    );
  }

  return (
    <div className="App">
      <div
        style={{
          backgroundImage: background
            ? `url(${background})`
            : "url(./images/mainBcgrnd.webp)",
          backgroundRepeat: background ? "round" : "initial",
          backgroundOrigin: background ? "border-box" : "",
          backgroundSize: background ? "cover" : "cover",
        }}
        className="background"
      ></div>
      <NavBar>
        <ul className="navbar">
          <li>
            <Logo />
          </li>
          <li>
            <SearchBar inptSearch={inptSearch} onSearch={handleSearch} />
          </li>
          <li>
            <MovieCount movies={movies} />
          </li>
        </ul>
      </NavBar>

      <Container>
        {trailerOpen ? <TrailerModal movieTrailer={movieTrailer} /> : ""}
        <Box>
          {isLoading && <Loader />}
          {!isLoading && (
            <MovieList
              onClickMovie={handleSelectIdBackground}
              movies={movies}
            />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <WatchedSelected
              onAddRating={handleWatched}
              onClose={handleClose}
              selectedId={selectedId}
              watched={watched}
              setMovieTrailer={setMovieTrailer}
              setTrailerOpen={setTrailerOpen}
            />
          ) : (
            <>
              <WatchedMoviesSummary watched={watched} selectedId={selectedId} />
              <WatchedList onDelete={handleDelete} watched={watched} />
            </>
          )}
        </Box>
      </Container>
    </div>
  );
}

function NavBar({ children }) {
  return <nav>{children}</nav>;
}

function SearchBar({ onSearch, inptSearch }) {
  const inputElement = useRef(null);

  useEffect(() => {
    inputElement.current.focus();

    function callback(e) {
      if (document.activeElement === inputElement.current) return;

      if (e.code === "Enter") {
        inputElement.current.focus();
        onSearch("");
      }
    }
    document.addEventListener("keydown", callback);
    return document.removeEventListener("keyup", callback);
  }, []);

  return (
    <input
      onChange={(e) => onSearch(e.target.value)}
      className="search"
      type="text"
      placeholder="Search Movies..."
      value={inptSearch}
      ref={inputElement}
    />
  );
}

function MovieCount({ movies }) {
  return (
    <span className="moviecount">
      Found <strong>{movies.length}</strong> Results
    </span>
  );
}

function Logo() {
  return <img className="logo" src="images/logo.png" alt="logo" />;
}

function Container({ children }) {
  return <div className="container">{children}</div>;
}

function Box({ children }) {
  return <div className="box">{children}</div>;
}

function MovieList({ movies, onClickMovie }) {
  return (
    <div className="movielist">
      {movies.map((movie) => (
        <Movies onClickMovie={onClickMovie} key={movie.imdbID} movie={movie} />
      ))}
    </div>
  );
}

function Movies({ movie, onClickMovie }) {
  const {
    Poster: poster,
    Title: title,
    Type: type,
    Year: year,
    imdbID,
  } = movie;
  return (
    <div onClick={() => onClickMovie(imdbID, poster)} className="movieListDiv">
      <img src={poster} alt="" />
      <div className="movieBasicInfo">
        <h2>{title}</h2>
        <p>{type}</p>
        <p>📆{year}</p>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="loadingDiv">
      <p className="loading">LOADING... </p>
    </div>
  );
}

function WatchedMoviesSummary({ watched }) {
  console.log(watched);
  const avgImdbRating = average(
    watched.map((movie) => movie.imdbRating)
  ).toFixed(2);
  const avgUserRating = average(
    watched.map((movie) => movie.userRating)
  ).toFixed(2);

  const avgRuntime = average(watched.map((movie) => movie.runtime));

  const watchedMovies = watched.length;
  return (
    <div className="watched">
      <h1 className="summaryheader">MOVIES YOU WATCHED</h1>
      <p className="summary">
        <span>
          <p className="pop">🍿</p>
          <p>{watchedMovies} MOVIES</p>
        </span>
        <span className="watchedLogo">
          <p className="imdb-logo">IMDb</p>
          <p>{avgImdbRating}</p>
        </span>
        <span>
          <p>⭐</p>
          <p>{avgUserRating} </p>
        </span>
        <span>
          <p>⌛</p>
          <p>{avgRuntime}</p>
        </span>
      </p>
    </div>
  );
}

/* function TopMovies() {
  console.log(topFive);

  return (
    <div className="movielist">
      <h1>IMDb Top 5 Movies</h1>
      {topFive.map((movie) => (
        <div className="movieListDiv">
          <img src={movie.Poster} alt="" />
          <div className="movieBasicInfo">
            <h2>{movie.title}</h2>
            <p>⭐{movie.imdbRating}</p>
          </div>
        </div>
      ))}
    </div>
  );
} */

function WatchedList({ watched, onDelete }) {
  return (
    <div className="watchedList">
      {watched?.map((movie) => (
        <WatchedMovie onDelete={onDelete} movie={movie} key={movie.imdbID} />
      ))}
    </div>
  );
}

function WatchedMovie({ movie, onDelete }) {
  return (
    <p className="watchedMovie">
      <span>
        <p>
          <img className="watchedPoster" src={movie.poster} alt="" />
        </p>
      </span>
      <span>
        <p>{movie.imdbRating}</p>
      </span>
      <span>
        <p>{movie.userRating}</p>
      </span>
      <span>
        <p>{movie.runtime}</p>
      </span>
      <span>
        <p>
          <button onClick={() => onDelete(movie.imdbID)} className="deleteBtn">
            <img src="./images/delete.png" alt="" />
          </button>
        </p>
      </span>
    </p>
  );
}

function WatchedSelected({
  selectedId,
  onClose,
  onAddRating,
  watched,
  setMovieTrailer,
  setTrailerOpen,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState("");

  const {
    Actors: actors,
    Plot: plot,
    Rated: rated,
    Released: released,
    Runtime: runtime,
    Writer: writer,
    imdbRating,
    Type: type,
    imdbID,
    Poster: poster,
    Title: title,
  } = movie;

  const isWatched = watched?.map((movie) => movie.imdbID).includes(selectedId);

  function handleAdd() {
    const addNewWatched = {
      imdbRating,
      userRating: Number(userRating),
      runtime: Number(runtime.split(" ").at(0)),
      poster,
      imdbID,
    };
    onAddRating(addNewWatched);
    onClose();
  }

  useEffect(() => {
    function callback(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", callback);
    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, [onClose]);

  useEffect(() => {
    async function fetchMovieDescription() {
      setIsLoading(true);
      try {
        const res =
          await fetch(`https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}
          `);
        const data = await res.json();
        setMovie(data);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovieDescription();
  }, [selectedId]);

  useEffect(() => {
    setIsLoading(true);
    async function fetchTrailer() {
      try {
        const res =
          type === "movie" &&
          (await fetch(
            `https://api.kinocheck.de/movies?imdb_id=${imdbID}&language=en`
          ));
        type === "series" &&
          (await fetch(
            `https://api.kinocheck.de/shows?imdb_id=${imdbID}&language=en`
          ));

        const data = await res.json();
        setMovieTrailer(data.trailer.youtube_video_id);
      } catch (err) {
        setError(err.message);
        setMovieTrailer("");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrailer();
  }, [imdbID, type, setMovieTrailer]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;
    return function () {
      document.title = "usePopcorn";
    };
  }, [title]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <header className="selectedMovieHeader">
            <button onClick={() => onClose()} className="back">
              ←
            </button>
            <img src={poster} alt="movieposter" />
            <div className="selectedMovieInfo">
              <h1>{title}</h1>
              <h3>{released}</h3>
              <p>
                <strong>Writer: </strong> {writer}
              </p>
              <p>
                <strong>Actors: </strong>
                {actors}
              </p>
              <div className="plotAndRuntimeDiv">
                <p>
                  <strong>Plot: </strong>
                  {plot}
                </p>
                <p>
                  <strong>• {runtime} •</strong>
                </p>
              </div>
              <div>
                <p>
                  <strong>IMDb Rating: {imdbRating}</strong>⭐
                </p>
                <p>{rated}</p>
              </div>
            </div>
          </header>
          <section className="rateSection">
            {!isWatched ? (
              <>
                <StarRating
                  onSetRating={setUserRating}
                  onRating={setUserRating}
                  maxRating={10}
                  size={28}
                />
                {userRating > 0 && (
                  <button className="addBtn" onClick={handleAdd}>
                    +Add
                  </button>
                )}
              </>
            ) : (
              <p>You've already rated this movie</p>
            )}
          </section>
          <section className="aditionalInfo">
            <StreamLogos title={title} />
            <div className="trailerBtnDiv">
              <button
                onClick={() => setTrailerOpen(true)}
                className="trailerBtn"
              >
                Watch Trailer
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );

  function StreamLogos() {
    return (
      <div>
        <ul className="streamLogo">
          <li>
            <a href="https://tv.apple.com/">
              <img src="./images/apple.png" alt="" />
            </a>
          </li>
          <li>
            <a href="https://www.apps.disneyplus.com/">
              <img src="./images/disney.jpg" alt="" />
            </a>
          </li>
          <li>
            <a href="https://www.max.com/">
              <img src="./images/hbo.png" alt="" />
            </a>
          </li>
          <li>
            <a href="https://www.netflix.com/">
              <img src="./images/netflix.png" alt="" />
            </a>
          </li>
          <li>
            <a href="https://www.paramountplus.com/">
              <img src="./images/0fa90bd5c402250ed2157e09543cf971.png" alt="" />
            </a>
          </li>
        </ul>
      </div>
    );
  }
}
