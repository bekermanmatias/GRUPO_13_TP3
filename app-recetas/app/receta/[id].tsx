import { useLocalSearchParams, useNavigation } from 'expo-router';
import RecipeDetail from '../components/RecipeDetail';
import { Text } from 'react-native';

export default function RecipePage() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();

  console.log('Received params in detail page:', params);

  if (!params.id || typeof params.id !== 'string') {
    console.log('Invalid or missing ID');
    return <Text>ID inválido o faltante</Text>;
  }

  return <RecipeDetail id={params.id} navigation={navigation} />;
} 