import { useLocalSearchParams } from 'expo-router';
import RecipeDetail from '../components/RecipeDetail';

export default function RecipePage() {
  const { id } = useLocalSearchParams();

  if (!id || typeof id !== 'string') return null;

  return <RecipeDetail id={id} />;
}
