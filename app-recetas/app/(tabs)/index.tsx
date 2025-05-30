// app/index.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Hola desde Expo Router!</Text>
      <Text>Esta es mi pantalla de inicio (index.js).</Text>
      {/* Ejemplo de enlace a otra pantalla (deberías crear app/otra.js) */}
      {/* <Link href="/otra">Ir a otra página</Link> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});