import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Pantalla de búsqueda funcionando!</Text>

      <Link href="/favorites" asChild>
        <Button title="Ver Favoritos" />
      </Link>

      <Link href="/receta/52772" asChild>
        <Button title="Ver receta de prueba (ID 52772)" />
      </Link>
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
