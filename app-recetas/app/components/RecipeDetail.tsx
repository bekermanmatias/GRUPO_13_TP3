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
import { useColorScheme } from 'react-native';


interface RecipeDetailProps {
  id: string;
  navigation?: any; // Para el botón de volver
}

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  [key: string]: any;
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

export default function RecipeDetail({ id, navigation }: RecipeDetailProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<CheckedIngredients>({});
  const colorScheme = useColorScheme(); // 🌗 detecta modo claro/oscuro
  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode); // 🎨 usa estilos según tema

  useEffect(() => {
    // Limpiar el estado anterior
    setRecipe(null);
    // Cargar los nuevos datos
    fetchRecipe();
    checkIfFavorite();
    loadCheckedIngredients();
  }, [id]); // Agregar id como dependencia

  const loadCheckedIngredients = async () => {
    try {
      const stored = await AsyncStorage.getItem(`checkedIngredients_${id}`);
      if (stored) {
        setCheckedIngredients(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading checked ingredients:', error);
    }
  };

  const toggleIngredient = async (ingredient: string) => {
    const newCheckedIngredients = {
      ...checkedIngredients,
      [ingredient]: !checkedIngredients[ingredient]
    };
    
    setCheckedIngredients(newCheckedIngredients);
    
    try {
      await AsyncStorage.setItem(
        `checkedIngredients_${id}`,
        JSON.stringify(newCheckedIngredients)
      );
    } catch (error) {
      console.error('Error saving checked ingredients:', error);
    }
  };

  const fetchRecipe = async () => {
    try {
      console.log('Fetching recipe with ID:', id);
      const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      if (res.data.meals && res.data.meals[0]) {
        console.log('Recipe found:', res.data.meals[0].strMeal);
        setRecipe(res.data.meals[0]);
      } else {
        console.log('No recipe found for ID:', id);
      }
    } catch (err) {
      console.error('Error al cargar la receta:', err);
    }
  };

  const checkIfFavorite = async () => {
    const stored = await AsyncStorage.getItem('favorites');
    const parsed: Recipe[] = stored ? JSON.parse(stored) : [];
    setIsFavorite(parsed.some(r => r.idMeal === id));
  };

  const toggleFavorite = async () => {
    const stored = await AsyncStorage.getItem('favorites');
    const parsed: Recipe[] = stored ? JSON.parse(stored) : [];

    let updated: Recipe[];
    if (isFavorite) {
      updated = parsed.filter(r => r.idMeal !== id);
    } else {
      if (!recipe) return;
      updated = [...parsed, recipe];
    }

    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  if (!recipe) return <Text style={{ padding: 16 }}>Cargando...</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#4CAF50" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.headerButton}
            onPress={toggleFavorite}
          >
            <Ionicons 
              name={isFavorite ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color="#4CAF50" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{recipe.strMeal}</Text>

        {recipe.strCategory && (
          <View style={styles.categoryContainer}>
            <Ionicons name="restaurant-outline" size={20} color="#4CAF50" />
            <Text style={styles.categoryText}>{recipe.strCategory}</Text>
            {recipe.strArea && (
              <>
                <Text style={styles.categoryDot}>•</Text>
                <Text style={styles.categoryText}>{recipe.strArea}</Text>
              </>
            )}
          </View>
        )}

        {recipe.strTags && (
          <View style={styles.tagsContainer}>
            {recipe.strTags.split(',').map((tag: string, index: number) => (
              <View key={index} style={styles.tagChip}>
                <Text style={styles.tagText}>{tag.trim()}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {Object.keys(checkedIngredients).length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={async () => {
                setCheckedIngredients({});
                await AsyncStorage.removeItem(`checkedIngredients_${id}`);
              }}
            >
              <Text style={styles.clearButtonText}>Clear all</Text>
            </TouchableOpacity>
          )}
        </View>

        {Array.from({ length: 20 }, (_, i) => {
          const ing = recipe[`strIngredient${i + 1}`];
          const measure = recipe[`strMeasure${i + 1}`];
          if (ing && ing.trim() !== '') {
            const ingredientKey = `${measure} ${ing}`;
            return (
              <TouchableOpacity
                key={i}
                style={styles.ingredientItem}
                onPress={() => toggleIngredient(ingredientKey)}
              >
                <View style={[
                  styles.checkbox,
                  checkedIngredients[ingredientKey] && styles.checkboxChecked
                ]}>
                  {checkedIngredients[ingredientKey] && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={[
                  styles.ingredientText,
                  checkedIngredients[ingredientKey] && styles.ingredientTextChecked
                ]}>
                  {ingredientKey}
                </Text>
              </TouchableOpacity>
            );
          }
          return null;
        })}

        <Text style={styles.sectionTitle}>Instructions</Text>
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
              <Text style={styles.stepNumber}>{index + 1}</Text>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}

        {recipe.strYoutube && isValidYoutubeUrl(recipe.strYoutube) && (
          <View style={styles.youtubeSection}>
            <Text style={styles.sectionTitle}>Video Tutorial</Text>
            <TouchableOpacity 
              style={styles.youtubeButton}
              onPress={() => {
                Linking.openURL(recipe.strYoutube);
              }}
            >
              <Ionicons name="logo-youtube" size={24} color="#FF0000" />
              <Text style={styles.youtubeButtonText}>Watch on YouTube</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? '#121212' : '#fff',
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
      backgroundColor: isDarkMode ? 'rgba(50,50,50,0.8)' : 'rgba(255,255,255,0.8)',
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
      color: isDarkMode ? '#fff' : '#000',
    },
    categoryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    categoryText: {
      fontSize: 14,
      color: '#4CAF50',
      marginLeft: 4,
    },
    categoryDot: {
      marginHorizontal: 4,
      color: '#4CAF50',
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginVertical: 8,
    },
    tagChip: {
      backgroundColor: isDarkMode ? '#1E3D3A' : '#e0f2f1',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
      marginRight: 6,
      marginBottom: 6,
    },
    tagText: {
      fontSize: 12,
      color: isDarkMode ? '#B2DFDB' : '#00796B',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
    },
    clearButton: {
      backgroundColor: '#f44336',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
    },
    clearButtonText: {
      color: '#fff',
      fontSize: 12,
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
      borderColor: '#4CAF50',
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      backgroundColor: '#4CAF50',
    },
    ingredientText: {
      fontSize: 16,
      color: isDarkMode ? '#ddd' : '#333',
      flex: 1,
    },
    ingredientTextChecked: {
      textDecorationLine: 'line-through',
      color: isDarkMode ? '#666' : '#888',
    },
    instructionStep: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    stepNumber: {
      marginRight: 8,
      fontWeight: 'bold',
      color: isDarkMode ? '#ccc' : '#000',
    },
    instructionText: {
      color: isDarkMode ? '#eee' : '#333',
      flex: 1,
    },
    youtubeSection: {
      marginTop: 20,
    },
    youtubeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    youtubeButtonText: {
      color: '#FF0000',
      marginLeft: 8,
    },
  });
