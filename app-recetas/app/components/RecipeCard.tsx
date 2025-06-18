import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addFavorite, removeFavorite, subscribeFavorites } from '../../database/favorites';
import { auth } from '../../firebaseConfig';
import { useThemeColor } from '../../hooks/useThemeColor';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb?: string;
}

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const cardBgColor = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = subscribeFavorites((favorites) => {
      setIsFavorite(favorites.some(fav => fav.idMeal === recipe.idMeal));
    });

    return unsubscribe;
  }, [recipe.idMeal]);

  const handlePress = () => {
    router.push(`/receta/${recipe.idMeal}`);
  };

  const handleFavoritePress = async () => {
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

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: cardBgColor }]} onPress={handlePress}>
      <Image 
        source={{ uri: recipe.strMealThumb }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
          {recipe.strMeal}
        </Text>
        <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? "#FF6B6B" : "#666"} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '48%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 4,
  },
});
