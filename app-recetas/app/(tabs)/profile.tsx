import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function Profile() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://i.pravatar.cc/999' }} // cambiar imagen por la del usuario
        style={styles.avatar}
      />
      <Text style={styles.name}>Juan Pérez</Text>
      <Text style={styles.email}>juan.perez@example.com</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
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
  },
});
