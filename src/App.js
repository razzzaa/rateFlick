import { useEffect, useState } from "react";

export default function App() {
  const [movies, setMovies] = useState({});

  const KEY = "86195a89";
  useEffect(() => {
    async function handleMoviesFetch() {
      const res = await fetch(`https://omdbapi.com/?apikey=${KEY}&s=friends`);
      const data = await res.json();
      console.log(data);
    }
    handleMoviesFetch();
  }, []);

  return (
    <div className="App">
      <NavBar />
      <Container>
        <Box></Box>
        <Box>
          <WatchedMovies />
        </Box>
      </Container>
    </div>
  );
}

function NavBar() {
  return (
    <ul className="navbar">
      <li>
        <Logo />
      </li>
      <li>
        <SearchBar />
      </li>
      <li>
        <MovieCount />
      </li>
    </ul>
  );
}

function SearchBar() {
  return (
    <input className="search" type="text" placeholder="🍿Search Movies..." />
  );
}

function MovieCount() {
  return <span className="moviecount">Found 0 Results</span>;
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

function MovieList() {
  return <div className="movielist"></div>;
}

function WatchedMovies() {
  return (
    <div className="watched">
      <h1 className="summaryheader">MOVIES YOU WATCHED</h1>
      <p className="summary">
        <span>
          <p>❤️</p>
          <p>0 MOVIES</p>
        </span>
        <span className="watchedLogo">
          <p className="imdb-logo">IMDb</p>
          <p>0.00</p>
        </span>
        <span>
          <p>⭐</p>
          <p>0.00 </p>
        </span>
        <span>
          <p>⌛</p>
          <p>0.00</p>
        </span>
      </p>
    </div>
  );
}

function WatchedSummary() {
  return;
}
