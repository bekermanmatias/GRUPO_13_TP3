import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { signOut, User } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme, useSetTheme } from '../../hooks/useColorScheme';
import { useThemeColor } from '../../hooks/useThemeColor';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const theme = useColorScheme();
  const setTheme = useSetTheme();
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const avatarBgColor = useThemeColor({}, 'avatarBackground');
  const buttonColor = useThemeColor({}, 'buttonPrimary');

  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.avatarContainer, { backgroundColor: avatarBgColor }]}>
        <Ionicons name="person" size={60} color="#fff" />
      </View>
      <Text style={[styles.name, { color: textColor }]}>{user.displayName || user.email?.split('@')[0]}</Text>
      <Text style={styles.email}>{user.email}</Text>
      
      <View style={styles.themeContainer}>
        <Text style={[styles.themeText, { color: textColor }]}>Dark mode</Text>
        <Switch
          value={theme === 'dark'}
          onValueChange={v => setTheme(v ? 'dark' : 'light')}
        />
      </View>
      
      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: buttonColor }]} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign out</Text>
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
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  themeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  themeText: {
    marginRight: 8,
  },

});
