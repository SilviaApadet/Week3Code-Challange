const filmsList = document.querySelector("#Films");
const title = document.getElementById("title");
const poster = document.getElementById("poster");
const runtime = document.getElementById("runtime");
const showtime = document.getElementById("showtime");
const tickets = document.getElementById("tickets");
const buyTicket = document.getElementById("buy");
const searchInput = document.querySelector('#search');

let currentFilmTickets = 0;

// Fetch and display film list
fetch('http://localhost:3000/Films')
  .then(res => res.json())
  .then(Films => {
    Films.forEach(film => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="card">
          <img src="${film.poster}" alt="${film.title}">
          <h3>${film.title}</h3>
          <p>${film.description}</p>
        </div>
      `;
      li.classList.add("item");
      li.addEventListener("click", () => {
        showFilmDetails(film);
      });
      filmsList.appendChild(li);
    });
    fetchFilmById(1); // Display the first film by default
  })
  .catch(error => {
    console.error("Error fetching list:", error);
  });

// Fetch film by ID
function fetchFilmById(id) {
  fetch(`http://localhost:3000/Films/${id}`)
    .then(res => res.json())
    .then(film => {
      showFilmDetails(film);
    })
    .catch(error => {
      console.error("Error fetching film:", error);
    });
}

// Search for movies
function searchItem() {
  const inputValue = searchInput.value.toLowerCase(); // Get input and convert to lowercase
  const allMovies = document.querySelectorAll("#Films li"); // Get all movie list items

  allMovies.forEach(movie => {
    const movieTitle = movie.querySelector("h3").textContent.toLowerCase(); // Get movie title and convert to lowercase
    if (movieTitle.includes(inputValue)) {
      movie.style.display = ""; // Show the movie if it matches
    } else {
      movie.style.display = "none"; // Hide the movie if it doesn't match
    }
  });
}

// Attach search function to input's `input` event
searchInput.addEventListener("input", searchItem);

// Display selected film details
function showFilmDetails(film) {
  title.textContent = film.title;
  poster.src = film.poster;
  runtime.textContent = `${film.runtime} mins`;
  showtime.textContent = film.showtime;
  currentFilmTickets = film.capacity - film.tickets_sold;
  tickets.textContent = currentFilmTickets;

  // Disable buy button if no tickets are available
  buyTicket.disabled = currentFilmTickets === 0;
}

// Handle ticket purchase
buyTicket.addEventListener("click", () => {
  if (currentFilmTickets > 0) {
    currentFilmTickets -= 1;
    tickets.textContent = currentFilmTickets;

    if (currentFilmTickets === 0) {
      alert("This showing is sold out!");
      buyTicket.disabled = true; // Disable button if sold out
    }
  } else {
    alert("Sorry, no tickets available!");
  }
});
