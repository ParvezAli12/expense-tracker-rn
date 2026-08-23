import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';

const SummaryCard = ({ summary }) => {
  const { income, expense, balance } = summary;

  return (
    <View style={styles.card}>
      <Text style={styles.balanceLabel}>Total Balance</Text>
      <Text style={styles.balanceAmount}>
        Rs {balance.toLocaleString('en-PK', { minimumFractionDigits: 0 })}
      </Text>

      <View style={styles.row}>
        <View style={styles.statBlock}>
          <View style={[styles.iconCircle, { backgroundColor: COLORS.success + '22' }]}>
            <Ionicons name="arrow-down" size={16} color={COLORS.success} />
          </View>
          <View style={styles.statTextGroup}>
            <Text style={styles.statLabel}>Income</Text>
            <Text style={[styles.statAmount, { color: COLORS.success }]} numberOfLines={1}>
              Rs {income.toLocaleString('en-PK', { minimumFractionDigits: 0 })}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statBlock}>
          <View style={[styles.iconCircle, { backgroundColor: COLORS.danger + '22' }]}>
            <Ionicons name="arrow-up" size={16} color={COLORS.danger} />
          </View>
          <View style={styles.statTextGroup}>
            <Text style={styles.statLabel}>Expense</Text>
            <Text style={[styles.statAmount, { color: COLORS.danger }]} numberOfLines={1}>
              Rs {expense.toLocaleString('en-PK', { minimumFractionDigits: 0 })}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SummaryCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
  },
  balanceLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT.base,
    marginBottom: SPACING.sm - 2,
  },
  balanceAmount: {
    color: COLORS.textPrimary,
    fontSize: FONT.display,
    fontWeight: '700',
    marginBottom: SPACING.xxl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md - 2,
  },
  statTextGroup: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT.sm,
  },
  statAmount: {
    fontSize: FONT.md + 1,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
});