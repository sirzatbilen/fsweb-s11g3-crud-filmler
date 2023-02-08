import React, { useEffect, useState } from "react";

import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import MovieList from "./components/MovieList";
import Movie from "./components/Movie";

import MovieHeader from "./components/MovieHeader";

import FavoriteMovieList from "./components/FavoriteMovieList";

import axios from "axios";
import EditMovieForm from "./components/EditMovieForm";
import AddMovieForm from "./components/AddMovieForm";

const App = (props) => {
  const [movies, setMovies] = useState([]);
  const [click, setClick] = useState();
  const { push } = useHistory();
  const [favoriteMovies, setFavoriteMovies] = useState(
    JSON.parse(localStorage.getItem("s11g3") || [])
  );

  useEffect(() => {
    localStorage.setItem("s11g3", JSON.stringify(favoriteMovies));
  }, [favoriteMovies]);

  useEffect(() => {
    axios
      .get("http://localhost:9000/api/movies")
      .then((res) => {
        setMovies(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [click]);

  const deleteMovie = (id) => {
    axios.delete(`http://localhost:9000/api/movies/${id}`).then((res) => {
      setClick(Math.random());
    });
  };

  const addToFavorites = (movie) => {
    setFavoriteMovies([...favoriteMovies, movie]);
  };

  const removeFav = (movie) => {
    setFavoriteMovies(favoriteMovies.filter((item) => item.id !== movie.id));
  };

  return (
    <div>
      <nav className="bg-zinc-800 px-6 py-3">
        <h1 className="text-xl text-white">HTTP / CRUD Film Projesi</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-3 pb-4">
        <MovieHeader />
        <div className="flex flex-col sm:flex-row gap-4">
          <FavoriteMovieList
            onRemoveFav={removeFav}
            favoriteMovies={favoriteMovies}
          />

          <Switch>
            <Route path="/movies/add">
              <AddMovieForm setClick={setClick} />
            </Route>
            <Route path="/movies/edit/:id">
              <EditMovieForm setClick={setClick} />
            </Route>

            <Route path="/movies/:id">
              <Movie
                addToFavorites={addToFavorites}
                deleteMovie={deleteMovie}
              />
            </Route>

            <Route path="/movies">
              <MovieList movies={movies} />
            </Route>

            <Route path="/">
              <Redirect to="/movies" />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default App;
