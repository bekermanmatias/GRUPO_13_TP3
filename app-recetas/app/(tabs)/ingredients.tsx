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
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { mealdbService } from '../../services/mealdbService';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Colors } from '../../constants/Colors';
import { useThemeColor } from '../../hooks/useThemeColor';
import LoadingSpinner from '../../components/LoadingSpinner';

const windowWidth = Dimensions.get('window').width;
const cardWidth = (windowWidth - 48) / 2;

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

interface Ingredient {
  strIngredient: string;
}

// Ingredientes comunes predefinidos
const commonIngredients = [
  'Chicken',
  'Beef',
  'Pork',
  'Fish',
  'Rice',
  'Pasta',
  'Tomato',
  'Potato',
  'Carrot',
  'Onion',
  'Garlic',
  'Cheese',
];

const IngredientsScreen = () => {
  const router = useRouter();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [availableIngredients, setAvailableIngredients] = useState(commonIngredients);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingIngredients, setLoadingIngredients] = useState(false);
  const [allIngredients, setAllIngredients] = useState<string[]>([]);
  const [maxResults, setMaxResults] = useState(12);
  const theme = useColorScheme();
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBgColor = useThemeColor({}, 'cardBackground');
  const searchBgColor = useThemeColor({}, 'searchBackground');
  const buttonPrimary = useThemeColor({}, 'buttonPrimary');

  useEffect(() => {
    loadAvailableIngredients();
    fetchAllIngredients();
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

  const fetchAllIngredients = async () => {
    setLoadingIngredients(true);
    try {
      const response = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
      if (response.data?.meals) {
        const ingredientsList = response.data.meals
          .map((item: Ingredient) => item.strIngredient)
          .filter((ingredient: string | null): ingredient is string => 
            ingredient !== null && ingredient !== undefined && ingredient.trim() !== ''
          );
        setAllIngredients(ingredientsList);
      }
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    } finally {
      setLoadingIngredients(false);
    }
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
      Alert.alert('Attention', 'Please select at least one ingredient');
      return;
    }

    setLoadingRecipes(true);
    try {
      const recipes = await mealdbService.searchByMultipleIngredients(selectedIngredients);
      setSearchResults(recipes);
      
      if (recipes.length === 0) {
        Alert.alert('No results', 'No recipes found with these ingredients');
      }
    } catch (error) {
      console.error('Error searching recipes:', error);
      Alert.alert('Error', 'Could not search for recipes');
    }
    setLoadingRecipes(false);
  };

  const searchRecipesByIngredient = async (ingredient: string) => {
    if (!ingredient) return;
    
    setLoading(true);
    setSelectedIngredient(ingredient);
    try {
      const encodedIngredient = encodeURIComponent(ingredient.trim());
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodedIngredient}`);
      setRecipes(response.data?.meals || []);
    } catch (error) {
      console.error('Error searching recipes:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredIngredients = () => {
    if (!searchText.trim()) return [];
    
    return allIngredients
      .filter(ingredient => 
        ingredient.toLowerCase().includes(searchText.toLowerCase())
      )
      .slice(0, maxResults);
  };

  const getTotalMatches = () => {
    if (!searchText.trim()) return 0;
    
    return allIngredients
      .filter(ingredient => 
        ingredient.toLowerCase().includes(searchText.toLowerCase())
      ).length;
  };

  const loadMoreResults = () => {
    setMaxResults(prev => prev + 12);
  };

  // Resetear maxResults cuando cambia la búsqueda
  useEffect(() => {
    setMaxResults(12);
  }, [searchText]);

  const renderIngredientItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.searchResultItem,
        selectedIngredient === item && styles.selectedIngredient
      ]}
      onPress={() => searchRecipesByIngredient(item)}
    >
      <Text style={[
        styles.searchResultText,
        selectedIngredient === item && styles.selectedText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderSelectedIngredient = ({ item }: { item: string }) => (
    <View style={styles.searchResultItem}>
      <Text style={styles.searchResultText}>{item}</Text>
    </View>
  );

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => router.push(`/receta/${item.idMeal}`)}
    >
      <Image 
        source={{ uri: item.strMealThumb }} 
        style={styles.recipeImage}
      />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle} numberOfLines={2}>
          {item.strMeal}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const filteredIngredients = getFilteredIngredients();

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Ingredients</Text>
      
      {/* Búsqueda de ingredientes */}
      <View style={[styles.searchContainer, { backgroundColor: searchBgColor }]}>
        <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { backgroundColor: 'transparent', color: textColor }]}
          placeholder="Search ingredient..."
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Mostrar ingredientes populares solo si no hay búsqueda */}
        {!searchText.trim() && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Popular Ingredients</Text>
            <View style={styles.popularGrid}>
              {commonIngredients.map((ingredient) => (
                <TouchableOpacity
                  key={ingredient}
                  style={[
                    styles.popularItem,
                    { backgroundColor: cardBgColor },
                    selectedIngredient === ingredient && styles.selectedIngredient
                  ]}
                  onPress={() => searchRecipesByIngredient(ingredient)}
                >
                  <Text style={[
                    styles.popularText,
                    { color: textColor },
                    selectedIngredient === ingredient && styles.selectedText
                  ]}>
                    {ingredient}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Resultados de búsqueda */}
        {searchText.trim() !== '' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Search Results</Text>
            {loadingIngredients ? (
              <LoadingSpinner size="small" style={styles.loader} />
            ) : filteredIngredients.length > 0 ? (
              <>
                <View style={styles.searchResults}>
                  {filteredIngredients.map((ingredient) => (
                    <TouchableOpacity
                      key={ingredient}
                      style={[
                        styles.searchResultItem,
                        { backgroundColor: cardBgColor },
                        selectedIngredient === ingredient && styles.selectedIngredient
                      ]}
                      onPress={() => searchRecipesByIngredient(ingredient)}
                    >
                      <Text style={[
                        styles.searchResultText,
                        { color: textColor },
                        selectedIngredient === ingredient && styles.selectedText
                      ]}>
                        {ingredient}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {getTotalMatches() > maxResults && (
                  <TouchableOpacity 
                    style={[styles.loadMoreButton, { backgroundColor: buttonPrimary }]} 
                    onPress={loadMoreResults}
                  >
                    <Text style={styles.loadMoreText}>
                      View more... ({getTotalMatches() - maxResults} remaining)
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <Text style={[styles.noResults, { color: textColor }]}>No ingredients found</Text>
            )}
          </View>
        )}

        {/* Resultados de recetas */}
        {selectedIngredient && (
          <View style={[styles.section, styles.recipesSection]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Recipes with {selectedIngredient}
            </Text>
            {loading ? (
              <LoadingSpinner size="large" style={styles.loader} />
            ) : recipes.length > 0 ? (
              <View style={styles.recipesContainer}>
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.idMeal} recipe={recipe} />
                ))}
              </View>
            ) : (
              <Text style={[styles.noResults, { color: textColor }]}>No recipes found</Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  section: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  recipesSection: {
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  popularItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    margin: 5,
    elevation: 2,
    minWidth: '30%',
    alignItems: 'center',
  },
  popularText: {
    fontSize: 14,
    textAlign: 'center',
  },
  searchResults: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
    justifyContent: 'space-between',
  },
  searchResultItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 5,
    elevation: 1,
    width: '30%',
    alignItems: 'center',
  },
  searchResultText: {
    fontSize: 14,
    textAlign: 'center',
  },
  selectedIngredient: {
    backgroundColor: '#4CAF50',
  },
  selectedText: {
    color: '#fff',
  },
  recipesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  recipeCard: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 6,
    marginBottom: 16,
    elevation: 3,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: cardWidth,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  recipeInfo: {
    padding: 12,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  loader: {
    marginTop: 20,
  },
  noResults: {
    fontSize: 16,
    fontStyle: 'italic',
    marginVertical: 10,
    textAlign: 'center',
  },
  loadMoreButton: {
    padding: 12,
    borderRadius: 8,
    margin: 5,
    elevation: 1,
    width: '100%',
    alignItems: 'center',
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default IngredientsScreen;