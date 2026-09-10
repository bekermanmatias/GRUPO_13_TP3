// services/mealdbService.js

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const mealdbService = {
  // Search recipes by a specific ingredient
  searchByIngredient: async (ingredient) => {
    try {
      const response = await fetch(`${BASE_URL}/filter.php?i=${ingredient}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('Error fetching recipes by ingredient:', error);
      return [];
    }
  },

  // Search recipes by multiple ingredients (custom implementation)
  searchByMultipleIngredients: async (ingredients) => {
    try {
      // The API doesn't support multiple ingredients directly
      // así que buscamos por cada uno y luego filtramos
      const allRecipes = [];
      const recipeCount = {};
      
      for (const ingredient of ingredients) {
        const recipes = await mealdbService.searchByIngredient(ingredient);
        recipes.forEach(recipe => {
          if (!recipeCount[recipe.idMeal]) {
            recipeCount[recipe.idMeal] = { recipe, count: 0 };
          }
          recipeCount[recipe.idMeal].count++;
        });
      }
      
      // Sort by number of matching ingredients
      const sortedRecipes = Object.values(recipeCount)
        .sort((a, b) => b.count - a.count)
        .map(item => ({
          ...item.recipe,
          matchingIngredients: item.count
        }));
      
      return sortedRecipes;
    } catch (error) {
      console.error('Error fetching recipes by multiple ingredients:', error);
      return [];
    }
  },

  // Obtener detalles completos de una receta
  getRecipeDetails: async (mealId) => {
    try {
      const response = await fetch(`${BASE_URL}/lookup.php?i=${mealId}`);
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      return null;
    }
  },

  // Get list of all available ingredients
  getAllIngredients: async () => {
    try {
      const response = await fetch(`${BASE_URL}/list.php?i=list`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('Error fetching ingredients list:', error);
      return [];
    }
  }
};