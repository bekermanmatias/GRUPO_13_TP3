import { useLocalSearchParams } from 'expo-router';
import RecipeDetail from '../components/RecipeDetail';

export default function RecipeDetailScreen() {
  const params = useLocalSearchParams();
  const id = typeof params.id === 'string' ? params.id : '';

  return <RecipeDetail id={id} />;
}
