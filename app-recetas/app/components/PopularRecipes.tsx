// src/components/PopularRecipes.tsx
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const recipes = [
  {
    title: 'Pasta Carbonara',
    image: 'https://source.unsplash.com/400x400/?pasta',
  },
  {
    title: 'Caesar Salad',
    image: 'https://source.unsplash.com/400x400/?salad',
  },
  {
    title: 'Tomato Soup',
    image: 'https://source.unsplash.com/400x400/?soup',
  },
];

export default function PopularRecipes() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {recipes.map((recipe, index) => (
        <View key={index} style={styles.card}>
          <Image source={{ uri: recipe.image }} style={styles.image} />
          <Text style={styles.title}>{recipe.title}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});
