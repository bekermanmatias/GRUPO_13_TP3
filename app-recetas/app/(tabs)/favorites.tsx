import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { auth } from '../../firebaseConfig';
import { subscribeFavorites } from '../../database/favorites';
import RecipeCard from '../components/RecipeCard';
import { useThemeColor } from '../../hooks/useThemeColor';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  useEffect(() => {
    const unsubscribe = subscribeFavorites((newFavorites) => {
      setFavorites(newFavorites);
    });

    return unsubscribe;
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>My Favorites</Text>
      {favorites.length === 0 ? (
        <Text style={[styles.emptyText, { color: textColor }]}>You don't have any favorite recipes yet</Text>
      ) : (
        <View style={styles.recipesContainer}>
          {favorites.map((recipe) => (
            <RecipeCard key={recipe.idMeal} recipe={recipe} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  recipesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
});
