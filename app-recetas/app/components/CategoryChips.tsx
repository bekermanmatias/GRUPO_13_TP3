// CategoryChips.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';

interface CategoryChipsProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export default function CategoryChips({ categories, selectedCategory, onCategorySelect }: CategoryChipsProps) {
  const cardBgColor = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const buttonPrimary = useThemeColor({}, 'buttonPrimary');

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.chip,
            { backgroundColor: selectedCategory === category ? buttonPrimary : cardBgColor }
          ]}
          onPress={() => onCategorySelect(category)}
        >
          <Text 
            style={[
              styles.chipText,
              { 
                color: selectedCategory === category ? '#fff' : textColor 
              }
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
