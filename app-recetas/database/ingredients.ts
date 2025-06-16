import { collection, doc, setDoc, deleteDoc, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

interface CheckedIngredients {
  [key: string]: boolean;
}

interface RecipeIngredients {
  recipeId: string;
  ingredients: CheckedIngredients;
  updatedAt: Date;
}

export const updateCheckedIngredients = async (recipeId: string, ingredients: CheckedIngredients) => {
  if (!auth.currentUser) return;

  const userIngredientsRef = doc(db, 'checkedIngredients', `${auth.currentUser.uid}_${recipeId}`);
  await setDoc(userIngredientsRef, {
    userId: auth.currentUser.uid,
    recipeId,
    ingredients,
    updatedAt: new Date(),
  });
};

export const getCheckedIngredients = async (recipeId: string): Promise<CheckedIngredients> => {
  if (!auth.currentUser) return {};

  try {
    const userIngredientsRef = doc(db, 'checkedIngredients', `${auth.currentUser.uid}_${recipeId}`);
    const snapshot = await getDocs(query(collection(db, 'checkedIngredients'), 
      where('userId', '==', auth.currentUser.uid),
      where('recipeId', '==', recipeId)
    ));

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return data.ingredients || {};
    }
    return {};
  } catch (error) {
    console.error('Error getting checked ingredients:', error);
    return {};
  }
};

export const subscribeToCheckedIngredients = (recipeId: string, callback: (ingredients: CheckedIngredients) => void) => {
  if (!auth.currentUser) return () => {};

  const q = query(
    collection(db, 'checkedIngredients'),
    where('userId', '==', auth.currentUser.uid),
    where('recipeId', '==', recipeId)
  );

  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      callback(data.ingredients || {});
    } else {
      callback({});
    }
  });
};

export const clearCheckedIngredients = async (recipeId: string) => {
  if (!auth.currentUser) return;

  const userIngredientsRef = doc(db, 'checkedIngredients', `${auth.currentUser.uid}_${recipeId}`);
  await deleteDoc(userIngredientsRef);
}; 