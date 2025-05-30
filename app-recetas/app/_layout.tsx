// app/_layout.js
import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Inicio' }} />
      {/* Aquí puedes añadir otras pantallas o grupos de Stack */}
    </Stack>
  );
}