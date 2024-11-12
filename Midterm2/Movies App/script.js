const apiKey = "4427b493e24373d37d43ee10829d7bed";
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

async function getRecommendedMovies() {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
  );
  const data = await response.json();
  displayMovies(data.results);
}

function displayMovies(movies) {
  const movieGrid = document.getElementById("movieGrid");
  movieGrid.innerHTML = "";

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.onclick = () => showMovieDetails(movie.id);

    movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Release Date: ${movie.release_date}</p>
            <p>Rating: ${movie.vote_average}</p>
            <button onclick="addToWatchlist(event, ${movie.id})">Add to Watchlist</button>
        `;

    movieGrid.appendChild(movieCard);
  });
}

function showMovieDetails(movieId) {
  window.location.href = `details.html?id=${movieId}`;
}

function openWatchlistPage() {
  window.location.href = "watchlist.html";
}

async function loadMovieDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");

  if (movieId) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,videos`
    );
    const movie = await response.json();

    document.getElementById("movieDetails").innerHTML = `
            <h2>${movie.title}</h2>
            <img src="https://image.tmdb.org/t/p/w300${
              movie.poster_path
            }" alt="${movie.title}">
            <p>Rating: ${movie.vote_average}</p>
            <p>Runtime: ${movie.runtime} minutes</p>
            <p>Synopsis: ${movie.overview}</p>
            <p>Cast: ${movie.credits.cast
              .slice(0, 5)
              .map((actor) => actor.name)
              .join(", ")}</p>
            ${
              movie.videos.results.length
                ? `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${movie.videos.results[0].key}" frameborder="0" allowfullscreen></iframe>`
                : "<p>No trailer available.</p>"
            }
        `;
  }
}

async function loadWatchlist() {
  const watchlistGrid = document.getElementById("watchlistGrid");
  watchlistGrid.innerHTML = ""; 

  if (watchlist.length > 0) {
    for (const movieId of watchlist) {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
      );
      const movie = await response.json();

      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");
      movieCard.onclick = () => showMovieDetails(movie.id);

      movieCard.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>Release Date: ${movie.release_date}</p>
                <p>Rating: ${movie.vote_average}</p>
                <button onclick="removeFromWatchlist(event, ${movie.id})">Remove</button>
            `;

      watchlistGrid.appendChild(movieCard);
    }
  } else {
    watchlistGrid.innerHTML = "<p>Your watchlist is empty.</p>";
  }
}

function addToWatchlist(event, movieId) {
  event.stopPropagation();
  if (!watchlist.includes(movieId)) {
    watchlist.push(movieId);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    alert("Movie added to watchlist!");
  } else {
    alert("This movie is already in your watchlist.");
  }
}

function removeFromWatchlist(event, movieId) {
  event.stopPropagation();
  watchlist = watchlist.filter((id) => id !== movieId);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  loadWatchlist(); 
}

async function searchMovies() {
  const searchInput = document.getElementById("searchInput").value;
  if (searchInput) {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
        searchInput
      )}`
    );
    const data = await response.json();
    displayMovies(data.results);
  }
}

async function sortMovies(sortBy) {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=${sortBy}.desc`
  );
  const data = await response.json();
  displayMovies(data.results);
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("details.html")) {
    loadMovieDetails();
  } else if (window.location.pathname.includes("watchlist.html")) {
    loadWatchlist();
  } else {
    getRecommendedMovies();
  }
});
