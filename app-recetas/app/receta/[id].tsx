// app/recipe/[id].tsx
import { useLocalSearchParams, useNavigation } from 'expo-router';
import RecipeDetail from '../components/RecipeDetail';

export default function RecipePage() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  if (!id || typeof id !== 'string') return null;

  return <RecipeDetail id={id} navigation={navigation} />;
}
