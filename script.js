const filmsList = document.querySelector("#Films");
const title = document.getElementById("title");
const poster = document.getElementById("poster");
const runtime = document.getElementById("runtime");
const showtime = document.getElementById("showtime");
const tickets = document.getElementById("tickets");
const buyTicket = document.getElementById("buy");
let currentFilmTickets = 0;

// Fetch movie data from db.json and populate the UI
fetch('./db.json')
  .then(res => res.json())
  .then(data => {
    const Films = data.Films; // Assuming Films is the array in db.json
    if (Films.length === 0) {
      filmsList.innerHTML = `<li>No films available.</li>`;
      return;
    }

    // Populate the movie list
    Films.forEach(film => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="card">
          <img src="${film.poster}" alt="${film.title}" class="film-poster">
          <h3>${film.title}</h3>
        </div>
      `;
      li.classList.add("item");
      li.addEventListener("click", () => {
        showFilmDetails(film);
      });
      filmsList.appendChild(li);
    });

    // Display the first film by default
    showFilmDetails(Films[0]);
  })
  .catch(error => {
    console.error("Error fetching data:", error);
    filmsList.innerHTML = `<li>Error loading films. Please try again later.</li>`;
  });

// Display selected film details
function showFilmDetails(film) {
  title.textContent = film.title;
  poster.src = film.poster;
  poster.alt = `${film.title} Poster`; // Update alt text for accessibility
  runtime.textContent = `${film.runtime} mins`;
  currentFilmTickets = film.capacity - film.ticketsSold; // Calculate available tickets
  tickets.textContent = currentFilmTickets;

  // Disable buy button if no tickets are available
  buyTicket.disabled = currentFilmTickets === 0;

  // Highlight the selected film
  document.querySelectorAll(".item").forEach(item => item.classList.remove("selected"));
  const selectedFilm = Array.from(filmsList.children).find(item =>
    item.querySelector("h3").textContent === film.title
  );
  if (selectedFilm) selectedFilm.classList.add("selected");
}

// Handle ticket purchase
buyTicket.addEventListener("click", () => {
  if (currentFilmTickets > 0) {
    currentFilmTickets -= 1;
    tickets.textContent = currentFilmTickets;

    // Simulate updating the tickets sold in the backend
    // In a real application, this would involve a PATCH/PUT request to update the server
    console.log(`Ticket purchased for: ${title.textContent}`);

    if (currentFilmTickets === 0) {
      alert("This showing is sold out!");
      buyTicket.disabled = true;
    }
  } else {
    alert("Sorry, no tickets available!");
  }
});
