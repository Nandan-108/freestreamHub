const idOfCategory = {
  all: 7,
  movies: 1,
  anime: 2,
  sports: 4,
};

// Filter sites by category
function filterCategory(element) {
  const cards = document.querySelectorAll(".site-card");
  cards.forEach((card) => {
    // if (card.style.display=="block") 
    card.style.display = (idOfCategory[element.id] & (+card.dataset.category)) > 0 ? "block" : "none";
  });

  // Update active category button
  document.querySelectorAll(".categories button").forEach((btn) => {
    btn.classList.remove("active");
  });
  element.classList.add("active");
}

// Search functionality
function filterSites() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll(".site-card");

  cards.forEach((card) => {
    const title = card.getAttribute('data-site-name').toLocaleLowerCase(); //card.querySelector("h3").textContent.toLowerCase();
    card.style.display = title.includes(searchTerm) ? "block" : "none";
  });
}

document
  .getElementById("searchInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      document.getElementById("search").click();
    }
  });

let currentSiteId = null;
let selectedRating = 0;

function signIn() {
  document.getElementById("ratingModal").style.display = "block";
}

function rateSite(site_id, site_name) {
  currentSiteId = site_id;
  document.getElementById("site_id").value = site_id;
  const modal = document.getElementById("ratingModal");
  modal.style.display = "block";
  document.getElementById("rateTitle").innerHTML = "Rate " + site_name;
}

function closeRatingModal() {
  document.getElementById("ratingModal").style.display = "none";
}

// Star hover/click handling
document.querySelectorAll(".modal-rating-stars .fa-star").forEach((star) => {
  star.addEventListener("mouseover", (e) => {
    const value = parseInt(e.target.dataset.value);
    highlightStars(value);
  });

  star.addEventListener("mouseout", () => {
    highlightStars(selectedRating);
  });

  star.addEventListener("click", (e) => {
    selectedRating = parseInt(e.target.dataset.value);
    document.getElementById("website_rating").value = selectedRating;
    highlightStars(selectedRating);
  });
});

function highlightStars(value) {
  document.querySelectorAll(".modal-rating-stars .fa-star").forEach((star) => {
    const starValue = parseInt(star.dataset.value);
    star.classList.toggle("fas", starValue <= value);
    star.classList.toggle("active", starValue <= value);
  });
}
