const API_KEY = "06297afdcd5248039e056d41063c94f9";
const searchInput = document.getElementById("search-input");
const recipeGrid = document.getElementById("recipe-grid");
const favoritesSection = document.getElementById("favorites-section");
const favoritesGrid = document.getElementById("favorites-grid");
const recipeModal = document.getElementById("recipe-modal");
const recipeTitle = document.getElementById("recipe-title");
const recipeImage = document.getElementById("recipe-image");
const recipeIngredients = document.getElementById("recipe-ingredients");
const recipeInstructions = document.getElementById("recipe-instructions");
const closeModalBtn = document.querySelector(".close-btn");
const favoriteBtn = document.getElementById("favorite-btn");
const viewFavoritesBtn = document.getElementById("view-favorites-btn");
const backToMainBtn = document.getElementById("back-to-main-btn");
const loading = document.getElementById("loading");
let currentRecipeId = null;

async function fetchRecipes(url) {
  loading.style.display = "block";
  recipeGrid.innerHTML = "";
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayRecipes(data.recipes || data.results);
  } catch (error) {
    console.error("Error fetching recipes:", error);
  } finally {
    loading.style.display = "none";
  }
}

function displayRecipes(recipes) {
  recipeGrid.innerHTML = "";
  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");
    recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <button onclick="showRecipeDetails(${recipe.id})">View Recipe</button>
        `;
    recipeGrid.appendChild(recipeCard);
  });
}

async function showRecipeDetails(id) {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
  );
  const recipe = await response.json();
  currentRecipeId = id;
  recipeTitle.textContent = recipe.title;
  recipeImage.src = recipe.image;
  recipeIngredients.innerHTML = `<strong>Ingredients:</strong><ul>${recipe.extendedIngredients
    .map((ingredient) => `<li>${ingredient.original}</li>`)
    .join("")}</ul>`;
  recipeInstructions.innerHTML = `<strong>Instructions:</strong> ${recipe.instructions}`;
  updateFavoriteButton();
  recipeModal.style.display = "flex";
}

function updateFavoriteButton() {
  const favorites = getFavorites();
  favoriteBtn.textContent = favorites.includes(currentRecipeId)
    ? "Remove from Favorites"
    : "Add to Favorites";
}

favoriteBtn.addEventListener("click", () => {
  const favorites = getFavorites();
  if (favorites.includes(currentRecipeId)) {
    removeFromFavorites(currentRecipeId);
    favoriteBtn.textContent = "Add to Favorites";
  } else {
    addToFavorites(currentRecipeId);
    favoriteBtn.textContent = "Remove from Favorites";
  }
});

viewFavoritesBtn.addEventListener("click", () => {
  recipeGrid.style.display = "none";
  favoritesSection.style.display = "block";
  viewFavoritesBtn.style.display = "none";
  backToMainBtn.style.display = "inline-block";
  displayFavorites();
});

backToMainBtn.addEventListener("click", () => {
  favoritesSection.style.display = "none";
  recipeGrid.style.display = "grid";
  backToMainBtn.style.display = "none";
  viewFavoritesBtn.style.display = "inline-block";
});

function displayFavorites() {
  const favorites = getFavorites();
  favoritesGrid.innerHTML = "";
  favorites.forEach(async (id) => {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
    );
    const recipe = await response.json();
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");
    recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <button onclick="showRecipeDetails(${recipe.id})">View Recipe</button>
        `;
    favoritesGrid.appendChild(recipeCard);
  });
}

function getFavorites() {
  const favorites = localStorage.getItem("favorites");
  return favorites ? JSON.parse(favorites) : [];
}

function addToFavorites(id) {
  const favorites = getFavorites();
  favorites.push(id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function removeFromFavorites(id) {
  let favorites = getFavorites();
  favorites = favorites.filter((favId) => favId !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

closeModalBtn.onclick = function () {
  recipeModal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target === recipeModal) {
    recipeModal.style.display = "none";
  }
};

window.addEventListener("load", () => {
  fetchRecipes(
    `https://api.spoonacular.com/recipes/random?number=8&apiKey=${API_KEY}`
  );
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value;
  if (query.length > 2) {
    fetchRecipes(
      `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${API_KEY}`
    );
    recipeGrid.style.display = "grid";
    favoritesSection.style.display = "none";
  } else {
    fetchRecipes(
      `https://api.spoonacular.com/recipes/random?number=8&apiKey=${API_KEY}`
    );
  }
});
