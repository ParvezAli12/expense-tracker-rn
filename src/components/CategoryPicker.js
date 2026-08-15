import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CategoryPicker = ({ categories, selected, onSelect }) => {
  return (
    <View style={styles.grid}>
      {categories.map((category) => {
        const isSelected = selected?.id === category.id;
        return (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.chip,
              isSelected && { backgroundColor: category.color, borderColor: category.color },
            ]}
            onPress={() => onSelect(category)}
          >
            <Ionicons
              name={category.icon}
              size={16}
              color={isSelected ? '#FFFFFF' : category.color}
            />
            <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CategoryPicker;

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#3A3A4C',
    backgroundColor: '#2A2A3C',
  },
  chipText: {
    color: '#CCCCCC',
    fontSize: 13,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});