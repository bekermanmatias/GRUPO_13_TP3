import { UserIngredient, Recipe } from '../types/database';

// Implementación mock para web usando localStorage
const WEB_STORAGE_KEY = {
  USER_INGREDIENTS: 'user_ingredients',
  RECIPES: 'recipes',
};

export const initDatabase = async (): Promise<void> => {
  try {
    // Inicializar almacenamiento si no existe
    if (!localStorage.getItem(WEB_STORAGE_KEY.USER_INGREDIENTS)) {
      localStorage.setItem(WEB_STORAGE_KEY.USER_INGREDIENTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(WEB_STORAGE_KEY.RECIPES)) {
      const sampleRecipes = [
        {
          name: "Pasta con tomate",
          ingredients: ["pasta", "tomate", "ajo", "aceite", "sal"],
          instructions: "1. Hervir la pasta\n2. Saltear ajo en aceite\n3. Agregar tomate\n4. Mezclar con pasta"
        },
        {
          name: "Ensalada simple",
          ingredients: ["lechuga", "tomate", "cebolla", "aceite", "vinagre"],
          instructions: "1. Cortar verduras\n2. Mezclar\n3. Aliñar con aceite y vinagre"
        }
      ];
      localStorage.setItem(WEB_STORAGE_KEY.RECIPES, JSON.stringify(sampleRecipes));
    }
    console.log('Web storage initialized successfully');
  } catch (error) {
    console.error('Error initializing web storage:', error);
  }
};

export const addUserIngredient = async (name: string, quantity: string, unit: string): Promise<void> => {
  try {
    const ingredients = JSON.parse(localStorage.getItem(WEB_STORAGE_KEY.USER_INGREDIENTS) || '[]');
    const newIngredient = {
      id: Date.now(),
      name: name.toLowerCase().trim(),
      quantity,
      unit,
      created_at: new Date().toISOString()
    };
    ingredients.push(newIngredient);
    localStorage.setItem(WEB_STORAGE_KEY.USER_INGREDIENTS, JSON.stringify(ingredients));
  } catch (error) {
    console.error('Error adding ingredient:', error);
    throw error;
  }
};

export const getUserIngredients = async (): Promise<UserIngredient[]> => {
  try {
    return JSON.parse(localStorage.getItem(WEB_STORAGE_KEY.USER_INGREDIENTS) || '[]');
  } catch (error) {
    console.error('Error getting ingredients:', error);
    return [];
  }
};

export const removeUserIngredient = async (id: number): Promise<void> => {
  try {
    const ingredients = JSON.parse(localStorage.getItem(WEB_STORAGE_KEY.USER_INGREDIENTS) || '[]');
    const filteredIngredients = ingredients.filter((ing: UserIngredient) => ing.id !== id);
    localStorage.setItem(WEB_STORAGE_KEY.USER_INGREDIENTS, JSON.stringify(filteredIngredients));
  } catch (error) {
    console.error('Error removing ingredient:', error);
    throw error;
  }
};

export const getAllRecipes = async (): Promise<Recipe[]> => {
  try {
    return JSON.parse(localStorage.getItem(WEB_STORAGE_KEY.RECIPES) || '[]');
  } catch (error) {
    console.error('Error getting recipes:', error);
    return [];
  }
}; 