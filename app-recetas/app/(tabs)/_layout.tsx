import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { initDatabase } from '../../database/database';

export default function TabsLayout() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#777',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0.5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Agregamos nueva tab para ingredientes */}
      <Tabs.Screen
        name="ingredients"
        options={{
          title: 'Ingredientes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}