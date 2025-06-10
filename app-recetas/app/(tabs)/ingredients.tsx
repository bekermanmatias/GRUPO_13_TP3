import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIngredients } from '../../hooks/useIngredients';
import { getAllRecipes } from '../../database/database';
import { findMatchingRecipes } from '../../utils/recipeSearch';
import { RecipeWithMatch } from '../../types/database';

export default function IngredientsScreen() {
  const { ingredients, loading, addIngredient, removeIngredient } = useIngredients();
  const [recipes, setRecipes] = useState<RecipeWithMatch[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Estados para el formulario
  const [ingredientName, setIngredientName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');

  const handleAddIngredient = async () => {
    if (!ingredientName.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre del ingrediente');
      return;
    }

    try {
      await addIngredient(ingredientName, quantity, unit);
      setIngredientName('');
      setQuantity('');
      setUnit('');
      Alert.alert('Éxito', 'Ingrediente agregado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el ingrediente');
    }
  };

  const handleRemoveIngredient = (id: number, name: string) => {
    Alert.alert(
      'Eliminar ingrediente',
      `¿Estás seguro de que quieres eliminar ${name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => removeIngredient(id) }
      ]
    );
  };

  const searchRecipes = async () => {
    if (ingredients.length === 0) {
      Alert.alert('Sin ingredientes', 'Agrega algunos ingredientes antes de buscar recetas');
      return;
    }

    try {
      setSearchLoading(true);
      const allRecipes = await getAllRecipes();
      const matchingRecipes = findMatchingRecipes(ingredients, allRecipes);
      setRecipes(matchingRecipes);
    } catch (error) {
      console.error('Error searching recipes:', error);
      Alert.alert('Error', 'No se pudieron buscar las recetas');
    } finally {
      setSearchLoading(false);
    }
  };

  const renderIngredient = ({ item }: { item: any }) => (
    <View style={styles.ingredientItem}>
      <View style={styles.ingredientInfo}>
        <Text style={styles.ingredientName}>{item.name}</Text>
        <Text style={styles.ingredientDetails}>
          {item.quantity} {item.unit}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleRemoveIngredient(item.id, item.name)}
        style={styles.removeButton}
      >
        <Ionicons name="trash-outline" size={20} color="#FF5252" />
      </TouchableOpacity>
    </View>
  );

  const renderRecipe = ({ item }: { item: RecipeWithMatch }) => {
    const recipeIngredients = JSON.parse(item.ingredients) as string[];
    
    return (
      <View style={styles.recipeCard}>
        <Text style={styles.recipeName}>{item.name}</Text>
        <Text style={styles.matchInfo}>
          {item.matchCount} de {recipeIngredients.length} ingredientes ({Math.round(item.matchPercentage)}%)
        </Text>
        <Text style={styles.matchingIngredients}>
          Tienes: {item.matchingIngredients.join(', ')}
        </Text>
        <Text style={styles.allIngredients}>
          Necesitas: {recipeIngredients.join(', ')}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Cargando ingredientes...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mis Ingredientes</Text>
      
      {/* Formulario para agregar ingredientes */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del ingrediente"
          value={ingredientName}
          onChangeText={setIngredientName}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.smallInput]}
            placeholder="Cantidad"
            value={quantity}
            onChangeText={setQuantity}
          />
          <TextInput
            style={[styles.input, styles.smallInput]}
            placeholder="Unidad (ej: kg, gr, tazas)"
            value={unit}
            onChangeText={setUnit}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddIngredient}>
          <Text style={styles.addButtonText}>Agregar Ingrediente</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de ingredientes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Ingredientes agregados ({ingredients.length})
        </Text>
        {ingredients.length === 0 ? (
          <Text style={styles.emptyText}>No tienes ingredientes agregados</Text>
        ) : (
          <FlatList
            data={ingredients}
            renderItem={renderIngredient}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        )}
      </View>

      {/* Botón de búsqueda */}
      {ingredients.length > 0 && (
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={searchRecipes}
          disabled={searchLoading}
        >
          {searchLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.searchButtonText}>
              Buscar Recetas Compatibles
            </Text>
          )}
        </TouchableOpacity>
      )}

      {/* Resultados de recetas */}
      {recipes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Recetas encontradas ({recipes.length})
          </Text>
          <FlatList
            data={recipes}
            renderItem={renderRecipe}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    marginTop: 40,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  smallInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 20,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  ingredientDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    padding: 8,
  },
  searchButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  recipeCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  matchInfo: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    marginBottom: 8,
  },
  matchingIngredients: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  allIngredients: {
    fontSize: 14,
    color: '#888',
  },
});