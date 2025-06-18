import { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CategoryChips from '../components/CategoryChips';
import RecipeCard from '../components/RecipeCard';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Colors } from '../../constants/Colors';
import { useThemeColor } from '../../hooks/useThemeColor';
import LoadingSpinner from '../../components/LoadingSpinner';

const categories = ['All', 'Beef', 'Chicken', 'Dessert', 'Lamb', 'Pasta', 'Seafood', 'Vegan', 'Vegetarian'];

export default function SearchScreen() {
  const sampleRecipe = { idMeal: '12345', strMeal: 'Pizza Margarita' };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const theme = useColorScheme();
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const searchBgColor = useThemeColor({}, 'searchBackground');

  const fetchRecipes = async (query: string, category: string) => {
    setLoading(true);
    try {
      let url = '';
      if (query) {
        url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
      } else if (category !== 'All') {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
      } else {
        url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
      }

      const response = await fetch(url);
      const data = await response.json();
      setRecipes(data.meals || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    fetchRecipes(text, selectedCategory);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    fetchRecipes(searchQuery, category);
  };

  useEffect(() => {
    fetchRecipes('', 'All');
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor }]} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={[styles.title, { color: textColor }]}>Search</Text>

      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: searchBgColor }]}>
        <Ionicons name="search-outline" size={20} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.input, { backgroundColor: 'transparent', color: textColor }]}
          placeholder="Search recipes"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Categories */}
      <Text style={[styles.sectionTitle, { color: textColor }]}>Browse by category</Text>
      <CategoryChips
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* Results */}
      <Text style={[styles.sectionTitle, { color: textColor }]}>Results</Text>
      {loading ? (
        <LoadingSpinner />
      ) : recipes.length === 0 ? (
        <Text style={[styles.noResults, { color: textColor }]}>No se encontraron recetas.</Text>
      ) : (
        <View style={styles.grid}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.idMeal} recipe={recipe} />
          ))}
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    height: 50,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderWidth: 0, 
    outlineColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  noResults: {
    fontSize: 16,
    fontStyle: 'italic',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 20,
  },
});
