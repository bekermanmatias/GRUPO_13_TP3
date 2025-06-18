// app/_layout.tsx
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { ThemeProvider } from '../hooks/useColorScheme';
import { initDatabase } from '../database/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  // Función para guardar el estado de autenticación
  const saveAuthState = async (user: User | null) => {
    try {
      if (Platform.OS !== 'web') {
        if (user) {
          await AsyncStorage.setItem('auth_user', JSON.stringify({
            uid: user.uid,
            email: user.email,
          }));
        } else {
          await AsyncStorage.removeItem('auth_user');
        }
      }
    } catch (error) {
      console.error('Error guardando estado de auth:', error);
    }
  };

  // Cargar estado de autenticación inicial
  useEffect(() => {
    const loadInitialAuth = async () => {
      try {
        if (Platform.OS !== 'web') {
          const savedAuth = await AsyncStorage.getItem('auth_user');
          if (savedAuth) {
            const parsedAuth = JSON.parse(savedAuth);
            setUser(parsedAuth);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error cargando estado inicial de auth:', error);
        setLoading(false);
      }
    };

    loadInitialAuth();
  }, []);

  useEffect(() => {
    // Inicializar la base de datos
    initDatabase();

    // Suscribirse a cambios de autenticación
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email);
      setUser(user);
      await saveAuthState(user);
      setLoading(false);
    }, (error) => {
      console.error('Auth error:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    console.log('Current segment:', segments[0], 'User:', user?.email, 'In auth group:', inAuthGroup);

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, segments, loading]);

  if (loading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
