import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function RecipeCard({ recipe }) {
  return (
    <Link href={`/receta/${recipe.idMeal}`} asChild>
      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
        <Text style={styles.title}>{recipe.strMeal}</Text>
      </TouchableOpacity>
    </Link>
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


  
  image: {
    width: '100%',
    height: 200,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    padding: 10,
  },
});
