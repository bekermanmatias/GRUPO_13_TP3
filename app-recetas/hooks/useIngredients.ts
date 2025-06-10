import { useState, useEffect } from 'react';
import { UserIngredient } from '../types/database';
import { getUserIngredients, addUserIngredient, removeUserIngredient } from '../database/database';

export const useIngredients = () => {
  const [ingredients, setIngredients] = useState<UserIngredient[]>([]);
  const [loading, setLoading] = useState(true);

  const loadIngredients = async () => {
    try {
      setLoading(true);
      const userIngredients = await getUserIngredients();
      setIngredients(userIngredients);
    } catch (error) {
      console.error('Error loading ingredients:', error);
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = async (name: string, quantity: string, unit: string) => {
    try {
      await addUserIngredient(name, quantity, unit);
      await loadIngredients();
    } catch (error) {
      console.error('Error adding ingredient:', error);
      throw error;
    }
  };

  const removeIngredient = async (id: number) => {
    try {
      await removeUserIngredient(id);
      await loadIngredients();
    } catch (error) {
      console.error('Error removing ingredient:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  return {
    ingredients,
    loading,
    addIngredient,
    removeIngredient,
    refreshIngredients: loadIngredients
  };
};