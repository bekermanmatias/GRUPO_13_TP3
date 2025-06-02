// CategoryChips.tsx
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function CategoryChips({ categories, selectedCategory, onCategorySelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          onPress={() => onCategorySelect(category)}
          style={[
            styles.chip,
            selectedCategory === category && styles.selectedChip,
          ]}
        >
          <Text
            style={[
              styles.chipText,
              selectedCategory === category && styles.selectedText,
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
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  chip: {
    backgroundColor: '#eef5ef',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  selectedChip: {
    backgroundColor: '#CDE4D4',
  },
  chipText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedText: {
    color: '#1B4332',
  },
});
