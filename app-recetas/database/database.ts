import * as SQLite from 'expo-sqlite';
import { UserIngredient, Recipe } from '../types/database';

const db = SQLite.openDatabaseAsync('recipes.db');

export const initDatabase = async (): Promise<void> => {
  const database = await db;
  
  try {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS user_ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        quantity TEXT,
        unit TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        ingredients TEXT NOT NULL,
        instructions TEXT,
        image_url TEXT,
        prep_time INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Insertar algunas recetas de ejemplo
    await insertSampleRecipes();
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

const insertSampleRecipes = async () => {
  const database = await db;
  try {
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

    for (const recipe of sampleRecipes) {
      await database.runAsync(
        'INSERT OR IGNORE INTO recipes (name, ingredients, instructions) VALUES (?, ?, ?)',
        [recipe.name, JSON.stringify(recipe.ingredients), recipe.instructions]
      );
    }
  } catch (error) {
    console.error('Error inserting sample recipes:', error);
  }
};

// Funciones para ingredientes
export const addUserIngredient = async (name: string, quantity: string, unit: string): Promise<void> => {
  const database = await db;
  try {
    await database.runAsync(
      'INSERT OR REPLACE INTO user_ingredients (name, quantity, unit) VALUES (?, ?, ?)',
      [name.toLowerCase().trim(), quantity, unit]
    );
  } catch (error) {
    console.error('Error adding ingredient:', error);
    throw error;
  }
};

export const getUserIngredients = async (): Promise<UserIngredient[]> => {
  const database = await db;
  try {
    const result = await database.getAllAsync('SELECT * FROM user_ingredients ORDER BY name');
    return result as UserIngredient[];
  } catch (error) {
    console.error('Error getting ingredients:', error);
    return [];
  }
};

export const removeUserIngredient = async (id: number): Promise<void> => {
  const database = await db;
  try {
    await database.runAsync('DELETE FROM user_ingredients WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error removing ingredient:', error);
    throw error;
  }
};

export const getAllRecipes = async (): Promise<Recipe[]> => {
  const database = await db;
  try {
    const result = await database.getAllAsync('SELECT * FROM recipes ORDER BY name');
    return result as Recipe[];
  } catch (error) {
    console.error('Error getting recipes:', error);
    return [];
  }
};