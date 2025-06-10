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
  ActivityIndicator,
  Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { mealdbService } from '../../services/mealdbService';

// Ingredientes comunes predefinidos
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
      // Si falla la API, usar ingredientes comunes
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
      Alert.alert('Atención', 'Selecciona al menos un ingrediente');
      return;
    }

    setLoadingRecipes(true);
    try {
      const recipes = await mealdbService.searchByMultipleIngredients(selectedIngredients);
      setSearchResults(recipes);
      
      if (recipes.length === 0) {
        Alert.alert('Sin resultados', 'No se encontraron recetas con estos ingredientes');
      }
    } catch (error) {
      console.error('Error searching recipes:', error);
      Alert.alert('Error', 'No se pudieron buscar las recetas');
    }
    setLoadingRecipes(false);
  };

  const filteredIngredients = availableIngredients.filter((ingredient: { strIngredient: string }) =>
    ingredient.strIngredient
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const renderIngredientItem = ({ item }: { item: { strIngredient: string } }) => {
    const ingredientName = typeof item === 'string' ? item : item.strIngredient;
    const isSelected = selectedIngredients.includes(ingredientName);
    
    return (
      <TouchableOpacity
        style={[styles.ingredientItem, isSelected && styles.selectedIngredient]}
        onPress={() => addIngredient(item)}
        disabled={isSelected}
      >
        <Text style={[styles.ingredientText, isSelected && styles.selectedText]}>
          {ingredientName}
        </Text>
        {isSelected && (
          <MaterialIcons name="check" size={20} color="#fff" />
        )}
      </TouchableOpacity>
    );
  };

  const renderSelectedIngredient = ({ item }: { item: string }) => (
    <View style={styles.selectedChip}>
      <Text style={styles.chipText}>{item}</Text>
      <TouchableOpacity onPress={() => removeIngredient(item)}>
        <MaterialIcons name="close" size={18} color="#666" />
      </TouchableOpacity>
    </View>
  );

  const renderRecipeItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.recipeItem}>
      <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{item.strMeal}</Text>
        <Text style={styles.recipeCategory}>{item.strCategory}</Text>
        {item.matchingIngredients && (
          <Text style={styles.matchingIngredients}>
            {item.matchingIngredients} ingrediente(s) coincidente(s)
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar por Ingredientes</Text>
      
      {/* Ingredientes seleccionados */}
      {selectedIngredients.length > 0 && (
        <View style={styles.selectedSection}>
          <Text style={styles.sectionTitle}>Ingredientes Seleccionados:</Text>
          <FlatList
            horizontal
            data={selectedIngredients}
            renderItem={renderSelectedIngredient}
            keyExtractor={(item) => item}
            style={styles.selectedList}
            showsHorizontalScrollIndicator={false}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={searchRecipesByIngredients}
            disabled={loadingRecipes}
          >
            {loadingRecipes ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.searchButtonText}>Buscar Recetas</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Buscador de ingredientes */}
      <View style={styles.searchSection}>
        <Text style={styles.sectionTitle}>Agregar Ingredientes:</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar ingrediente..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Lista de ingredientes disponibles */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <FlatList
          data={searchText ? filteredIngredients : commonIngredients}
          renderItem={renderIngredientItem}
          keyExtractor={(item, index) => `${item.strIngredient || item}-${index}`}
          style={styles.ingredientsList}
          numColumns={2}
        />
      )}

      {/* Resultados de recetas */}
      {searchResults.length > 0 && (
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Recetas Encontradas:</Text>
          <FlatList
            data={searchResults}
            renderItem={renderRecipeItem}
            keyExtractor={(item) => item.idMeal}
            style={styles.recipesList}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  selectedSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedList: {
    marginBottom: 15,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  chipText: {
    marginRight: 8,
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchSection: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  ingredientsList: {
    flex: 1,
    marginBottom: 20,
  },
  ingredientItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    margin: 4,
    borderRadius: 8,
    elevation: 1,
  },
  selectedIngredient: {
    backgroundColor: '#007AFF',
  },
  ingredientText: {
    fontSize: 14,
  },
  selectedText: {
    color: '#fff',
  },
  loader: {
    marginTop: 50,
  },
  resultsSection: {
    marginTop: 20,
  },
  recipesList: {
    maxHeight: 300,
  },
  recipeItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
  },
  recipeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recipeCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  matchingIngredients: {
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
  },
});

export default Ingredients;