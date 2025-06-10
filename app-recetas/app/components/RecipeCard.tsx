import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkIfFavorite();
  }, []);

  const checkIfFavorite = async () => {
    const stored = await AsyncStorage.getItem('favorites');
    const parsed: Recipe[] = stored ? JSON.parse(stored) : [];
    setIsFavorite(parsed.some(r => r.idMeal === recipe.idMeal));
  };

  const toggleFavorite = async (event: any) => {
    event.preventDefault(); // Evita la navegación al detalle
    const stored = await AsyncStorage.getItem('favorites');
    const parsed: Recipe[] = stored ? JSON.parse(stored) : [];

    let updated: Recipe[];
    if (isFavorite) {
      updated = parsed.filter(r => r.idMeal !== recipe.idMeal);
    } else {
      updated = [...parsed, recipe];
    }

    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  const handlePress = () => {
    router.replace({
      pathname: "/(tabs)/receta/[id]",
      params: { id: recipe.idMeal }
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={toggleFavorite}
        >
          <Ionicons 
            name={isFavorite ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color="#4CAF50"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.title} numberOfLines={2}>{recipe.strMeal}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 8,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    padding: 10,
    minHeight: 60,
  },
});
