import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RecipeCard from '../components/RecipeCard';

// Tipo para la receta
interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  [key: string]: any;
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const data = await AsyncStorage.getItem('favorites');
        const parsed: Recipe[] = data ? JSON.parse(data) : [];
        setFavorites(parsed);
      } catch (error) {
        console.error('Error cargando favoritos:', error);
      }
    };

    loadFavorites();
  }, []);

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No hay recetas favoritas.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.idMeal}
      renderItem={({ item }) => <RecipeCard recipe={item} />}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
