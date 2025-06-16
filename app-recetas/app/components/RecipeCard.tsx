import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addFavorite, removeFavorite, subscribeFavorites } from '../../database/favorites';
import { auth } from '../../firebaseConfig';

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
    let unsubscribe: () => void;

    if (auth.currentUser) {
      unsubscribe = subscribeFavorites((favorites) => {
        setIsFavorite(favorites.some(r => r.idMeal === recipe.idMeal));
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [recipe.idMeal]);

  const toggleFavorite = async (event: any) => {
    event.stopPropagation(); // Evita la navegación al detalle
    
    if (!auth.currentUser) {
      router.push('/profile');
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite(recipe.idMeal);
      } else {
        await addFavorite(recipe);
      }
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
    }
  };

  const handlePress = () => {
    router.push(`/receta/${recipe.idMeal}`);
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
