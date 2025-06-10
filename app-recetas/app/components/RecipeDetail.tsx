import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; 


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

export default function RecipeDetail({ id, navigation }: RecipeDetailProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Limpiar el estado anterior
    setRecipe(null);
    // Cargar los nuevos datos
    fetchRecipe();
    checkIfFavorite();
  }, [id]); // Agregar id como dependencia

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

        <Text style={styles.description}>
          This creamy tomato pasta is a quick and easy weeknight meal that's packed with flavor.
        </Text>

        <Text style={styles.sectionTitle}>Ingredients</Text>
        {Array.from({ length: 20 }, (_, i) => {
          const ing = recipe[`strIngredient${i + 1}`];
          const measure = recipe[`strMeasure${i + 1}`];
          return ing && ing.trim() !== '' ? (
            <View key={i} style={styles.ingredientItem}>
              <View style={styles.checkbox} />
              <Text style={styles.ingredientText}>{`${measure} ${ing}`}</Text>
            </View>
          ) : null;
        })}

        <Text style={styles.sectionTitle}>Instructions</Text>
        <View style={styles.step}>
          <Ionicons name="restaurant" size={20} color="#4CAF50" />
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepText}>Cook the pasta</Text>
            <Text style={styles.stepTime}>10 minutes</Text>
          </View>
        </View>
        <View style={styles.step}>
          <Ionicons name="flame" size={20} color="#4CAF50" />
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepText}>Make the sauce</Text>
            <Text style={styles.stepTime}>5 minutes</Text>
          </View>
        </View>
        <View style={styles.step}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepText}>Combine and serve</Text>
            <Text style={styles.stepTime}>2 minutes</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
    color: '#555',
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
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 16,
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
    color: '#666',
  },
});
