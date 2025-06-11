import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';
import { signOut, User } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons'; // Importá íconos

export default function Profile() {
  const router = useRouter();
  const { theme, mode, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Cargando usuario...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Botón de cambio de tema */}
      <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
      <Ionicons name={mode === 'light' ? 'moon' : 'sunny'} size={28} color={theme.text} />

      </TouchableOpacity>

      <Image
        source={{
          uri: user.photoURL || 'https://i.pravatar.cc/120?u=' + user.email,
        }}
        style={styles.avatar}
      />
      <Text style={[styles.name, { color: theme.text }]}>
        {user.displayName || user.email?.split('@')[0]}
      </Text>
      <Text style={[styles.email, { color: theme.text }]}>{user.email}</Text>

      <View style={{ marginTop: 20, width: '100%' }}>
        <Button title="Cerrar sesión" color={theme.primary} onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  themeToggle: {
    position: 'absolute',
    top: 50,
    right: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 16,
  },
});
