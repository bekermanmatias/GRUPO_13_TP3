// app/_layout.tsx
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ?? null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const inAuthGroup = ['(auth)'].includes(segments[0] as string);

    if (!loading) {
      if (!user && !inAuthGroup) {
        router.replace('../(auth)/login');
      } else if (user && inAuthGroup) {
        router.replace('/');
      }
    }
  }, [user, segments, loading]);

  if (loading) return null;

  return <Slot />;
}
