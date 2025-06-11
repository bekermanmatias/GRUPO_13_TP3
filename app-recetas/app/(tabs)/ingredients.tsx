// app/(tabs)/ingredients.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { mealdbService } from '../../services/mealdbService';
import { useTheme } from '../../src/context/ThemeContext'; // Asegurate que el path sea correcto

const commonIngredients = [
  { strIngredient: 'Chicken' },
  { strIngredient: 'Beef' },
  { strIngredient: 'Pork' },
  { strIngredient: 'Fish' },
  { strIngredient: 'Rice' },
  { strIngredient: 'Pasta' },
  { strIngredient: 'Tomato' },
  { strIngredient: 'Onion' },
  { strIngredient: 'Garlic' },
  { strIngredient: 'Potato' },
  { strIngredient: 'Carrot' },
  { strIngredient: 'Cheese' },
  { strIngredient: 'Egg' },
  { strIngredient: 'Milk' },
  { strIngredient: 'Flour' },
  { strIngredient: 'Sugar' },
  { strIngredient: 'Salt' },
  { strIngredient: 'Pepper' },
  { strIngredient: 'Oil' },
  { strIngredient: 'Butter' }
];

const Ingredients = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [availableIngredients, setAvailableIngredients] = useState(commonIngredients);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  useEffect(() => {
    loadAvailableIngredients();
  }, []);

  const loadAvailableIngredients = async () => {
    setLoading(true);
    try {
      const ingredients = await mealdbService.getAllIngredients();
      setAvailableIngredients(ingredients);
    } catch (error) {
      console.error('Error loading ingredients:', error);
      setAvailableIngredients(commonIngredients);
    }
    setLoading(false);
  };

  const addIngredient = (ingredient: { strIngredient: string } | string) => {
    const ingredientName = typeof ingredient === 'string' ? ingredient : ingredient.strIngredient;
    if (!selectedIngredients.includes(ingredientName)) {
      setSelectedIngredients([...selectedIngredients, ingredientName]);
      setSearchText('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
  };

  const searchRecipesByIngredients = async () => {
    if (selectedIngredients.length === 0) {
      Alert.alert('Atención', 'Seleccioná al menos un ingrediente');
      return;
    }

    setLoadingRecipes(true);
    try {
      const recipes = await mealdbService.searchByMultipleIngredients(selectedIngredients);
      setSearchResults(recipes);
      if (recipes.length === 0) {
        Alert.alert('Sin resultados', 'No se encontraron recetas con esos ingredientes');
      }
    } catch (error) {
      console.error('Error searching recipes:', error);
      Alert.alert('Error', 'No se pudieron buscar las recetas');
    }
    setLoadingRecipes(false);
  };

  const filteredIngredients = availableIngredients.filter((ingredient: { strIngredient: string }) =>
    ingredient.strIngredient.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderIngredientItem = ({ item }: { item: { strIngredient: string } }) => {
    const ingredientName = item.strIngredient;
    const isSelected = selectedIngredients.includes(ingredientName);

    return (
      <TouchableOpacity
        style={[
          styles.ingredientItem,
          { backgroundColor: isSelected ? theme.primary : theme.inputBackground, borderColor: theme.border }
        ]}
        onPress={() =>
          isSelected ? removeIngredient(ingredientName) : addIngredient(ingredientName)
        }
      >
        <Text style={{ color: isSelected ? theme.buttonText : theme.text }}>{ingredientName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Ingredientes</Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
            color: theme.text
          }
        ]}
        placeholder="Buscar ingrediente..."
        placeholderTextColor={theme.placeholderText}
        value={searchText}
        onChangeText={setSearchText}
      />

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : (
        <FlatList
          data={filteredIngredients}
          keyExtractor={(item, index) => item.strIngredient + index}
          renderItem={renderIngredientItem}
          style={{ marginBottom: 20 }}
        />
      )}

      <TouchableOpacity
        style={[styles.searchButton, { backgroundColor: theme.primary }]}
        onPress={searchRecipesByIngredients}
        disabled={loadingRecipes}
      >
        {loadingRecipes ? (
          <ActivityIndicator size="small" color={theme.buttonText} />
        ) : (
          <Text style={[styles.searchButtonText, { color: theme.buttonText }]}>
            Buscar recetas
          </Text>
        )}
      </TouchableOpacity>

      <Text style={[styles.subtitle, { color: theme.text }]}>Seleccionados:</Text>
      <View style={styles.selectedList}>
        {selectedIngredients.map((ingredient) => (
          <TouchableOpacity
            key={ingredient}
            onPress={() => removeIngredient(ingredient)}
            style={[styles.selectedItem, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}
          >
            <Text style={{ color: theme.text }}>{ingredient} ✕</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Ingredients;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    fontSize: 16,
  },
  ingredientItem: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
  },
  searchButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: '600',
  },
  selectedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedItem: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
});
