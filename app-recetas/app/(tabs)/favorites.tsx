import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RecipeCard from '../components/RecipeCard';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const stored = await AsyncStorage.getItem('favorites');
      const parsed = stored ? JSON.parse(stored) : [];
      setFavorites(parsed);
    };
    const unsubscribe = loadFavorites();
    return () => { unsubscribe; };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Recetas Favoritas</Text>
      {favorites.length > 0 ? (
        favorites.map((recipe) => (
          <RecipeCard key={recipe.idMeal} recipe={recipe} />
        ))
      ) : (
        <Text>No hay recetas favoritas aún.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
