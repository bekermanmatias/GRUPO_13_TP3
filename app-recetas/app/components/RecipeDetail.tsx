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
    fetchRecipe();
    checkIfFavorite();
  }, []);

  const fetchRecipe = async () => {
    try {
      const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      setRecipe(res.data.meals?.[0]);
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
      {/* Header */}
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} />
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleFavorite}>
        <Ionicons name={isFavorite ? "bookmark" : "bookmark-outline"} size={24} />
      </TouchableOpacity>
    </View>

      {/* Imagen */}
      <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />

      {/* Título */}
      <Text style={styles.title}>{recipe.strMeal}</Text>

      {/* Descripción mock */}
      <Text style={styles.description}>
        This creamy tomato pasta is a quick and easy weeknight meal that's packed with flavor.
      </Text>

      {/* Ingredientes */}
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

      {/* Instrucciones simuladas */}
      <Text style={styles.sectionTitle}>Instructions</Text>
      <View style={styles.step}>
      <Ionicons name="restaurant" size={20} />
      <View style={styles.stepTextContainer}>
        <Text style={styles.stepText}>Cook the pasta</Text>
        <Text style={styles.stepTime}>10 minutes</Text>
      </View>
    </View>
    <View style={styles.step}>
      <Ionicons name="flame" size={20} />
      <View style={styles.stepTextContainer}>
        <Text style={styles.stepText}>Make the sauce</Text>
        <Text style={styles.stepTime}>5 minutes</Text>
      </View>
    </View>
    <View style={styles.step}>
      <Ionicons name="checkmark-circle-outline" size={20} />
      <View style={styles.stepTextContainer}>
        <Text style={styles.stepText}>Combine and serve</Text>
        <Text style={styles.stepTime}>2 minutes</Text>
      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    width: '90%',
    height: 220,
    borderRadius: 12,
    alignSelf: 'center',
    marginVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 16,
    color: '#555',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#aaa',
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
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
    color: '#888',
  },
});
