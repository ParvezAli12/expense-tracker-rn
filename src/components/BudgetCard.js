import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getCategoryByLabel } from '../constants/categories';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';

const BudgetCard = ({ budget, onPress, onLongPress }) => {
  const { category, limit, spent, percentage } = budget;
  const categoryData = getCategoryByLabel(category, 'expense');
  const clampedPercentage = Math.min(percentage, 100);

  // Green under 70%, yellow 70-99%, red at/over 100%
  const barColor =
    percentage >= 100 ? COLORS.danger : percentage >= 70 ? '#FFD93D' : COLORS.success;

  const remaining = limit - spent;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} onLongPress={onLongPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.dot, { backgroundColor: categoryData.color }]} />
          <Text style={styles.categoryLabel}>{category}</Text>
        </View>
        <Text style={styles.percentText}>{Math.round(percentage)}%</Text>
      </View>

      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${clampedPercentage}%`, backgroundColor: barColor }]} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.spentText}>
          Rs {spent.toLocaleString('en-PK')} <Text style={styles.ofText}>of Rs {limit.toLocaleString('en-PK')}</Text>
        </Text>
        <Text style={[styles.remainingText, { color: remaining < 0 ? COLORS.danger : COLORS.textMuted }]}>
          {remaining < 0
            ? `Rs ${Math.abs(remaining).toLocaleString('en-PK')} over`
            : `Rs ${remaining.toLocaleString('en-PK')} left`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default BudgetCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg - 2,
    marginBottom: SPACING.sm + 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm + 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryLabel: {
    color: COLORS.textPrimary,
    fontSize: FONT.md,
    fontWeight: '600',
  },
  percentText: {
    color: COLORS.textSecondary,
    fontSize: FONT.base,
    fontWeight: '600',
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spentText: {
    color: COLORS.textPrimary,
    fontSize: FONT.sm,
    fontWeight: '600',
  },
  ofText: {
    color: COLORS.textMuted,
    fontWeight: '400',
  },
  remainingText: {
    fontSize: FONT.sm,
    fontWeight: '600',
  },
});