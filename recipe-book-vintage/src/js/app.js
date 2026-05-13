let favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];
let customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || [];

function getAllRecipes() {
  return [...customRecipes, ...recipes];
}

function toggleFavorite(recipeId) {
  const index = favorites.indexOf(recipeId);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(recipeId);
  }
  localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
  updateFavoriteButtons();
  
  if (typeof renderRecipeCards === 'function') {
    const currentCategory = document.querySelector('.category-badge.active')?.dataset.category || 'all';
    if (window.location.pathname.includes('favorites')) {
      renderFavoriteRecipes();
    } else if (!window.location.pathname.includes('detail')) {
      renderRecipeCards(currentCategory);
    }
  }
}

function updateFavoriteButtons() {
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    const recipeId = parseInt(btn.dataset.id);
    if (favorites.includes(recipeId)) {
      btn.classList.add('active');
      btn.innerHTML = '❤️';
    } else {
      btn.classList.remove('active');
      btn.innerHTML = '🤍';
    }
  });
}

function getRecipeById(id) {
  return getAllRecipes().find(r => r.id === parseInt(id));
}
