import { collection, doc, setDoc, deleteDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FavoriteRecipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  userId: string;
  createdAt: Date;
}

// Función para limpiar el AsyncStorage de favoritos
export const clearAsyncStorageFavorites = async () => {
  try {
    await AsyncStorage.removeItem('favorites');
  } catch (error) {
    console.error('Error al limpiar favoritos de AsyncStorage:', error);
  }
};

// Función para escuchar cambios en favoritos
export const subscribeFavorites = (onFavoritesChange: (favorites: FavoriteRecipe[]) => void) => {
  const user = auth.currentUser;
  if (!user) return () => {};

  const favoritesRef = collection(db, 'favorites');
  const q = query(favoritesRef, where('userId', '==', user.uid));
  
  return onSnapshot(q, (snapshot) => {
    const favorites = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate()
      } as FavoriteRecipe;
    });
    onFavoritesChange(favorites);
  }, (error) => {
    console.error('Error al escuchar cambios en favoritos:', error);
  });
};

export const addFavorite = async (recipe: Omit<FavoriteRecipe, 'userId' | 'createdAt'>) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const favoriteRef = doc(collection(db, 'favorites'), `${user.uid}_${recipe.idMeal}`);
    await setDoc(favoriteRef, {
      ...recipe,
      userId: user.uid,
      createdAt: new Date()
    });
    await clearAsyncStorageFavorites(); // Limpiar AsyncStorage después de agregar
  } catch (error) {
    console.error('Error al agregar favorito:', error);
    throw error;
  }
};

export const removeFavorite = async (recipeId: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const favoriteRef = doc(db, 'favorites', `${user.uid}_${recipeId}`);
    await deleteDoc(favoriteRef);
    await clearAsyncStorageFavorites(); // Limpiar AsyncStorage después de eliminar
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
    throw error;
  }
};

export const getFavorites = async (): Promise<FavoriteRecipe[]> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const favoritesRef = collection(db, 'favorites');
    const q = query(favoritesRef, where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    
    await clearAsyncStorageFavorites(); // Limpiar AsyncStorage antes de retornar
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate()
      } as FavoriteRecipe;
    });
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    throw error;
  }
}; 