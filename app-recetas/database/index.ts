import { Platform } from 'react-native';
import * as NativeDB from './database';
import * as WebDB from './database.web';

export const {
  initDatabase,
  addUserIngredient,
  getUserIngredients,
  removeUserIngredient,
  getAllRecipes,
} = Platform.select({
  web: WebDB,
  default: NativeDB,
}); 