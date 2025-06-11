import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RecipeCard from '../components/RecipeCard';
import { useTheme } from '../../src/context/ThemeContext'; // Asegurate del path correcto

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const loadFavorites = async () => {
      const stored = await AsyncStorage.getItem('favorites');
      const parsed = stored ? JSON.parse(stored) : [];
      setFavorites(parsed);
    };
    loadFavorites();
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <Text style={[styles.title, { color: theme.text }]}>Favoritos</Text>

      {favorites.length > 0 ? (
        <View style={styles.grid}>
          {favorites.map((recipe) => (
            <RecipeCard key={recipe.idMeal} recipe={recipe} />
          ))}
        </View>
      ) : (
        <Text style={[styles.noResults, { color: theme.placeholderText }]}>
          No hay recetas favoritas.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  noResults: {
    fontSize: 16,
    fontStyle: 'italic',
    marginVertical: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
});
