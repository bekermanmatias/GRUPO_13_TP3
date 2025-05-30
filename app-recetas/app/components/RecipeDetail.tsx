import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Tipo de props
interface RecipeDetailProps {
  id: string;
}

// Tipo para los datos de la receta
interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  [key: string]: any; // Para los ingredientes y medidas dinámicas
}

export default function RecipeDetail({ id }: RecipeDetailProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchRecipe();
    checkIfFavorite();
  }, []);

  const fetchRecipe = async (): Promise<void> => {
    try {
      const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      const data = res.data.meals?.[0];
      setRecipe(data);
    } catch (err) {
      console.error('Error al cargar la receta:', err);
    }
  };

  const checkIfFavorite = async (): Promise<void> => {
    const stored = await AsyncStorage.getItem('favorites');
    const parsed: Recipe[] = stored ? JSON.parse(stored) : [];
    const exists = parsed.some((r) => r.idMeal === id);
    setIsFavorite(exists);
  };

  const toggleFavorite = async (): Promise<void> => {
    const stored = await AsyncStorage.getItem('favorites');
    const parsed: Recipe[] = stored ? JSON.parse(stored) : [];

    let updated: Recipe[];
    if (isFavorite) {
      updated = parsed.filter((r) => r.idMeal !== id);
    } else {
      if (recipe) {
        updated = [...parsed, recipe];
      } else {
        return;
      }
    }

    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  if (!recipe) return <Text>Cargando...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{recipe.strMeal}</Text>
      <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
      <Button
        title={isFavorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
        onPress={toggleFavorite}
      />
      <Text style={styles.subtitle}>Ingredientes:</Text>
      {[...Array(20).keys()].map((i) => {
        const ing = recipe[`strIngredient${i + 1}`];
        const measure = recipe[`strMeasure${i + 1}`];
        return ing ? (
          <Text key={i}>
            - {ing} ({measure})
          </Text>
        ) : null;
      })}
      <Text style={styles.subtitle}>Instrucciones:</Text>
      <Text>{recipe.strInstructions}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  image: {
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
});
