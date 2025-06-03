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
    loadFavorites();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={styles.title}>Favorites</Text>
      {favorites.length > 0 ? (
        <View style={styles.grid}>
          {favorites.map((recipe) => (
            <RecipeCard key={recipe.idMeal} recipe={recipe} />
          ))}
        </View>
      ) : (
        <Text style={styles.noResults}> Favorites   </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FFFA',
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
    color: '#888',
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
