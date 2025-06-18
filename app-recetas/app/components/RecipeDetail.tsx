import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { addFavorite, removeFavorite, subscribeFavorites } from '../../database/favorites';
import { updateCheckedIngredients, subscribeToCheckedIngredients, clearCheckedIngredients } from '../../database/ingredients';
import { auth } from '../../firebaseConfig';
import { useRouter } from 'expo-router';
import { useThemeColor } from '../../hooks/useThemeColor';
import LoadingSpinner from '../../components/LoadingSpinner';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  [key: string]: any;
}

interface RecipeDetailProps {
  id: string;
}

interface CheckedIngredients {
  [key: string]: boolean;
}

const isValidYoutubeUrl = (url: string | null): boolean => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com';
  } catch {
    return false;
  }
};

export default function RecipeDetail({ id }: RecipeDetailProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<CheckedIngredients>({});
  const router = useRouter();
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBgColor = useThemeColor({}, 'cardBackground');
  const buttonPrimary = useThemeColor({}, 'buttonPrimary');
  const buttonSecondary = useThemeColor({}, 'buttonSecondary');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        if (response.data.meals && response.data.meals[0]) {
          setRecipe(response.data.meals[0]);
        }
      } catch (error) {
        console.error('Error al cargar la receta:', error);
      }
    };

    fetchRecipe();
  }, [id]);

  useEffect(() => {
    let unsubscribe: () => void;

    if (auth.currentUser) {
      unsubscribe = subscribeFavorites((favorites) => {
        setIsFavorite(favorites.some(r => r.idMeal === id));
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [id]);

  useEffect(() => {
    let unsubscribe: () => void;

    if (auth.currentUser) {
      unsubscribe = subscribeToCheckedIngredients(id, (ingredients) => {
        setCheckedIngredients(ingredients);
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [id]);

  const toggleIngredient = async (ingredient: string) => {
    if (!auth.currentUser) {
      router.push('/profile');
      return;
    }

    const newCheckedIngredients = {
      ...checkedIngredients,
      [ingredient]: !checkedIngredients[ingredient]
    };
    
    try {
      await updateCheckedIngredients(id, newCheckedIngredients);
    } catch (error) {
      console.error('Error updating checked ingredients:', error);
    }
  };

  const handleClearIngredients = async () => {
    try {
      await clearCheckedIngredients(id);
    } catch (error) {
      console.error('Error clearing ingredients:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!auth.currentUser) {
      router.push('/profile');
      return;
    }

    try {
      if (recipe) {
        if (isFavorite) {
          await removeFavorite(recipe.idMeal);
        } else {
          await addFavorite(recipe);
        }
      }
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
    }
  };

  if (!recipe) {
    return <LoadingSpinner />;
  }

  // Extraer ingredientes y medidas
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({ ingredient, measure });
    }
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: cardBgColor }]} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={buttonPrimary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: cardBgColor }]}
            onPress={toggleFavorite}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#FF6B6B" : buttonPrimary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>{recipe.strMeal}</Text>

        {recipe.strCategory && (
          <View style={styles.categoryContainer}>
            <Ionicons name="restaurant-outline" size={20} color={buttonPrimary} />
            <Text style={[styles.categoryText, { color: textColor }]}>{recipe.strCategory}</Text>
            {recipe.strArea && (
              <>
                <Text style={[styles.categoryDot, { color: textColor }]}>•</Text>
                <Text style={[styles.categoryText, { color: textColor }]}>{recipe.strArea}</Text>
              </>
            )}
          </View>
        )}

        {recipe.strTags && (
          <View style={styles.tagsContainer}>
            {recipe.strTags.split(',').map((tag: string, index: number) => (
              <View key={index} style={[styles.tagChip, { backgroundColor: buttonSecondary }]}>
                <Text style={[styles.tagText, { color: buttonPrimary }]}>{tag.trim()}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Ingredients</Text>
          {Object.keys(checkedIngredients).length > 0 && (
            <TouchableOpacity
              style={[styles.clearButton, { backgroundColor: buttonSecondary }]}
              onPress={handleClearIngredients}
            >
              <Text style={[styles.clearButtonText, { color: textColor }]}>Clear all</Text>
            </TouchableOpacity>
          )}
        </View>

        {ingredients.map(({ ingredient, measure }, index) => (
          <TouchableOpacity
            key={index}
            style={styles.ingredientItem}
            onPress={() => toggleIngredient(ingredient)}
          >
            <View style={[
              styles.checkbox,
              { borderColor: buttonPrimary },
              checkedIngredients[ingredient] && { backgroundColor: buttonPrimary }
            ]}>
              {checkedIngredients[ingredient] && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
            <Text style={[
              styles.ingredientText,
              { color: textColor },
              checkedIngredients[ingredient] && styles.ingredientTextChecked
            ]}>
              {measure} {ingredient}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionTitle, { color: textColor }]}>Instructions</Text>
        {recipe.strInstructions
          .split('\r\n')
          .filter(instruction => {
            const trimmed = instruction.trim();
            // Filtrar líneas vacías, STEP X, números solos, y "Serves X"
            return trimmed && 
                   !trimmed.match(/^STEP\s*\d+$/i) && // "STEP X"
                   !trimmed.match(/^\d+$/) && // Números solos
                   !trimmed.match(/^Serves\s+\d+$/i) && // "Serves X"
                   trimmed.length > 3; // Evitar textos muy cortos
          })
          .map(instruction => {
            // Eliminar números y puntos del principio de la instrucción
            return instruction.trim().replace(/^\d+\.\s*/, '');
          })
          .filter(instruction => instruction.length > 0) // Eliminar cualquier línea que quedó vacía
          .map((instruction, index) => (
            <View key={index} style={styles.instructionStep}>
              <Text style={[styles.stepNumber, { backgroundColor: buttonPrimary }]}>{index + 1}</Text>
              <Text style={[styles.instructionText, { color: textColor }]}>{instruction}</Text>
            </View>
          ))}

        {recipe.strYoutube && isValidYoutubeUrl(recipe.strYoutube) && (
          <View style={styles.youtubeSection}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Video Tutorial</Text>
            <TouchableOpacity 
              style={[styles.youtubeButton, { backgroundColor: cardBgColor }]}
              onPress={() => {
                Linking.openURL(recipe.strYoutube);
              }}
            >
              <Ionicons name="logo-youtube" size={24} color="#FF0000" />
              <Text style={[styles.youtubeButtonText, { color: textColor }]}>Watch on YouTube</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  headerButtons: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerButton: {
    borderRadius: 20,
    padding: 8,
    elevation: 2,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    // Se maneja dinámicamente en el componente
  },
  ingredientText: {
    fontSize: 16,
    flex: 1,
  },
  ingredientTextChecked: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepTextContainer: {
    marginLeft: 12,
  },
  stepText: {
    fontSize: 16,
    fontWeight: '500',
  },
  stepTime: {
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  clearButtonText: {
    fontSize: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 16,
    marginLeft: 8,
  },
  categoryDot: {
    marginHorizontal: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingRight: 16,
  },
  stepNumber: {
    color: '#fff',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  youtubeSection: {
    marginTop: 24,
  },
  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  youtubeButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
});
