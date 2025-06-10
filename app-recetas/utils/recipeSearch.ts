import { UserIngredient, Recipe, RecipeWithMatch } from '../types/database';

export const findMatchingRecipes = (
  userIngredients: UserIngredient[], 
  allRecipes: Recipe[]
): RecipeWithMatch[] => {
  return allRecipes
    .map(recipe => {
      const recipeIngredients = JSON.parse(recipe.ingredients) as string[];
      const matchingIngredients = recipeIngredients.filter(ingredient => 
        userIngredients.some(userIng => 
          userIng.name.toLowerCase() === ingredient.toLowerCase()
        )
      );
      
      const matchCount = matchingIngredients.length;
      const matchPercentage = (matchCount / recipeIngredients.length) * 100;

      return {
        ...recipe,
        matchCount,
        matchPercentage,
        matchingIngredients
      };
    })
    .filter(recipe => recipe.matchCount > 0)
    .sort((a, b) => {
      // Primero por cantidad de coincidencias, luego por porcentaje
      if (b.matchCount !== a.matchCount) {
        return b.matchCount - a.matchCount;
      }
      return b.matchPercentage - a.matchPercentage;
    });
};