export interface UserIngredient {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  created_at: string;
}

export interface Recipe {
  id: number;
  name: string;
  ingredients: string; // JSON string de array de ingredientes
  instructions: string;
  image_url?: string;
  prep_time?: number;
  created_at: string;
}

export interface RecipeWithMatch extends Recipe {
  matchCount: number;
  matchPercentage: number;
  matchingIngredients: string[];
}