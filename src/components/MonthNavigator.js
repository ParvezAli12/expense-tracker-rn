import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MonthNavigator = ({
  year,
  month,
  isPrevDisabled,
  isNextDisabled,
  onPrev,
  onNext,
  onJumpToday,
  showJumpToday = false,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPrev}
        disabled={isPrevDisabled}
        style={[styles.arrow, isPrevDisabled && styles.arrowDisabled]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="chevron-back" size={20} color={isPrevDisabled ? '#444' : COLORS.textPrimary} />
      </TouchableOpacity>

      {/* Fixed-width center column — label content never shifts the arrows,
          regardless of whether the month name is "May" or "September" */}
      <View style={styles.labelContainer}>
        <TouchableOpacity
          onPress={showJumpToday ? onJumpToday : undefined}
          disabled={!showJumpToday || isNextDisabled}
          activeOpacity={showJumpToday ? 0.6 : 1}
        >
          <Text style={styles.label} numberOfLines={1}>
            {MONTH_NAMES[month - 1]} {year}
          </Text>
          <Text style={[styles.jumpLink, (!showJumpToday || isNextDisabled) && styles.jumpLinkHidden]}>
            Jump to today
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onNext}
        disabled={isNextDisabled}
        style={[styles.arrow, isNextDisabled && styles.arrowDisabled]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="chevron-forward" size={20} color={isNextDisabled ? '#444' : COLORS.textPrimary} />
      </TouchableOpacity>
    </View>
  );
};

export default MonthNavigator;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  arrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowDisabled: {
    backgroundColor: COLORS.borderSubtle,
  },
  labelContainer: {
    width: 190,
    alignItems: 'center',
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: FONT.xl + 1,
    fontWeight: '700',
    textAlign: 'center',
  },
  jumpLink: {
    color: COLORS.primary,
    fontSize: FONT.xs,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  jumpLinkHidden: {
    opacity: 0,
  },
});