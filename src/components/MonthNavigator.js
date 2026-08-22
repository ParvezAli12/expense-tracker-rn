import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
        <Ionicons name="chevron-back" size={20} color={isPrevDisabled ? '#444' : '#FFFFFF'} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={showJumpToday ? onJumpToday : undefined}
        disabled={!showJumpToday || isNextDisabled}
        style={styles.labelContainer}
      >
        <Text style={styles.label}>{MONTH_NAMES[month - 1]} {year}</Text>
        {showJumpToday && !isNextDisabled && (
          <Text style={styles.jumpLink}>Jump to today</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onNext}
        disabled={isNextDisabled}
        style={[styles.arrow, isNextDisabled && styles.arrowDisabled]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="chevron-forward" size={20} color={isNextDisabled ? '#444' : '#FFFFFF'} />
      </TouchableOpacity>
    </View>
  );
};

export default MonthNavigator;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingHorizontal: 20,
    gap: 24,
  },
  arrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2A2A3C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowDisabled: {
    backgroundColor: '#22222E',
  },
  labelContainer: {
    alignItems: 'center',
    minWidth: 150,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  jumpLink: {
    color: '#6C5CE7',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});