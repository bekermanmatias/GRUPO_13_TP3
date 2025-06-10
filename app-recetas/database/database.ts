import * as SQLite from 'expo-sqlite';
import { UserIngredient, Recipe } from '../types/database';

const db = SQLite.openDatabase('recipes.db');

export const initDatabase = async (): Promise<void> => {
  try {
    await new Promise<void>((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS user_ingredients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            quantity TEXT,
            unit TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );`,
          [],
          () => {
            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS recipes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                ingredients TEXT NOT NULL,
                instructions TEXT,
                image_url TEXT,
                prep_time INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
              );`,
              [],
              () => {
                resolve();
              },
              (_, error) => {
                reject(error);
                return false;
              }
            );
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });

    // Insertar algunas recetas de ejemplo
    await insertSampleRecipes();
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

const insertSampleRecipes = async () => {
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

    await new Promise<void>((resolve, reject) => {
      db.transaction(tx => {
        sampleRecipes.forEach(recipe => {
          tx.executeSql(
            'INSERT OR IGNORE INTO recipes (name, ingredients, instructions) VALUES (?, ?, ?)',
            [recipe.name, JSON.stringify(recipe.ingredients), recipe.instructions],
            undefined,
            (_, error) => {
              reject(error);
              return false;
            }
          );
        });
        resolve();
      });
    });
  } catch (error) {
    console.error('Error inserting sample recipes:', error);
  }
};

// Funciones para ingredientes
export const addUserIngredient = async (name: string, quantity: string, unit: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT OR REPLACE INTO user_ingredients (name, quantity, unit) VALUES (?, ?, ?)',
        [name.toLowerCase().trim(), quantity, unit],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getUserIngredients = async (): Promise<UserIngredient[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM user_ingredients ORDER BY name',
        [],
        (_, { rows: { _array } }) => resolve(_array as UserIngredient[]),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const removeUserIngredient = async (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM user_ingredients WHERE id = ?',
        [id],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getAllRecipes = async (): Promise<Recipe[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM recipes ORDER BY name',
        [],
        (_, { rows: { _array } }) => resolve(_array as Recipe[]),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};