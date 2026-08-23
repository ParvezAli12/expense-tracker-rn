import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';

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
              color={isSelected ? COLORS.textPrimary : category.color}
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
    gap: SPACING.sm + 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  chipText: {
    color: '#CCCCCC',
    fontSize: FONT.base,
    fontWeight: '500',
  },
  chipTextActive: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
});