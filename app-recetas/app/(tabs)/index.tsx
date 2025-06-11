import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext'; // asegurate de importar correctamente
import CategoryChips from '../components/CategoryChips';
import RecipeCard from '../components/RecipeCard';

const categories = ['All', 'Beef', 'Chicken', 'Dessert', 'Lamb', 'Pasta', 'Seafood', 'Vegan', 'Vegetarian'];

export default function SearchScreen() {
  const { theme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={[styles.title, { color: theme.text }]}>Search</Text>

      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: theme.inputBackground }]}>
        <Ionicons name="search-outline" size={20} color={theme.placeholderText} style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Search recipes"
          placeholderTextColor={theme.placeholderText}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Categories */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Browse by category</Text>
      <CategoryChips
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* Results */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Results</Text>
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
      ) : recipes.length === 0 ? (
        <Text style={[styles.noResults, { color: theme.placeholderText }]}>No se encontraron recetas.</Text>
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
    paddingHorizontal: 20,
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    height: 50,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderWidth: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
  },
  noResults: {
    fontSize: 16,
    fontStyle: 'italic',
    marginVertical: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
});
