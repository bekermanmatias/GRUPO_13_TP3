import { collection, doc, setDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  [key: string]: any;
}

export const addFavorite = async (recipe: Recipe) => {
  if (!auth.currentUser) return;
  
  const userFavoritesRef = doc(db, 'favorites', `${auth.currentUser.uid}_${recipe.idMeal}`);
  await setDoc(userFavoritesRef, {
    userId: auth.currentUser.uid,
    ...recipe,
    createdAt: new Date(),
  });
};

export const removeFavorite = async (recipeId: string) => {
  if (!auth.currentUser) return;
  
  const favoriteRef = doc(db, 'favorites', `${auth.currentUser.uid}_${recipeId}`);
  await deleteDoc(favoriteRef);
};

export const subscribeFavorites = (callback: (favorites: Recipe[]) => void) => {
  if (!auth.currentUser) return () => {};

  const favoritesRef = collection(db, 'favorites');
  const q = query(favoritesRef, where('userId', '==', auth.currentUser.uid));

  return onSnapshot(q, (snapshot) => {
    const favorites = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        idMeal: data.idMeal,
        strMeal: data.strMeal,
        strMealThumb: data.strMealThumb,
      };
    });
    callback(favorites);
  });
}; 