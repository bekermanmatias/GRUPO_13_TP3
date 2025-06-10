import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { signOut, User } from 'firebase/auth'; // Importar User
import { auth } from '../../firebaseConfig';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);  // <User | null>

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
      <Image
        source={{
          uri: user.photoURL || 'https://i.pravatar.cc/120?u=' + user.email,
        }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{user.displayName || user.email?.split('@')[0]}</Text>
      <Text style={styles.email}>{user.email}</Text>
      
      <Button title="Cerrar sesión" onPress={handleLogout} />
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
    color: 'gray',
    marginTop: 4,
    marginBottom: 16,
  },
});
