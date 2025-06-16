import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { signOut, User } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const router = useRouter();
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
      <View style={styles.container}>
        <Text>Cargando usuario...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person" size={60} color="#fff" />
      </View>
      <Text style={styles.name}>{user.displayName || user.email?.split('@')[0]}</Text>
      <Text style={styles.email}>{user.email}</Text>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F8FFFA',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#9E9E9E',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 32,
  },
  logoutButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
