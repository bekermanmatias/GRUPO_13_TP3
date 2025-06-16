import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { auth } from '../../firebaseConfig';
import { subscribeFavorites } from '../../database/favorites';
import RecipeCard from '../components/RecipeCard';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  useEffect(() => {
    let unsubscribe: () => void;

    if (auth.currentUser) {
      unsubscribe = subscribeFavorites((newFavorites) => {
        setFavorites(newFavorites);
      });
    } else {
      setFavorites([]);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [auth.currentUser]);

  if (!auth.currentUser) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Inicia sesión para ver tus favoritos</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Favoritos</Text>
        {favorites.length === 0 ? (
          <Text style={styles.noResults}>No tienes recetas favoritas</Text>
        ) : (
          <View style={styles.grid}>
            {favorites.map((recipe) => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FFFA',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
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
    gap: 16,
  },
});
