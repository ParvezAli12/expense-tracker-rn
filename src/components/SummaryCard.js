import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';

// A single animated number — counts smoothly from its previous value to `value`
const AnimatedAmount = ({ value, style, prefix = 'Rs ' }) => {
  const animatedValue = useRef(new Animated.Value(value)).current;
  const [displayValue, setDisplayValue] = React.useState(value);

  useEffect(() => {
    const listenerId = animatedValue.addListener(({ value: v }) => {
      setDisplayValue(Math.round(v));
    });

    Animated.timing(animatedValue, {
      toValue: value,
      duration: 600,
      useNativeDriver: false, // animating a numeric value we read via listener, not a style transform
    }).start();

    return () => {
      animatedValue.removeListener(listenerId);
    };
  }, [value]);

  return (
    <Text style={style}>
      {prefix}{displayValue.toLocaleString('en-PK')}
    </Text>
  );
};

const SummaryCard = ({ summary }) => {
  const { income, expense, balance } = summary;

  return (
    <View style={styles.card}>
      <Text style={styles.balanceLabel}>Total Balance</Text>
      <AnimatedAmount value={balance} style={styles.balanceAmount} />

      <View style={styles.row}>
        <View style={styles.statBlock}>
          <View style={[styles.iconCircle, { backgroundColor: COLORS.success + '22' }]}>
            <Ionicons name="arrow-down" size={16} color={COLORS.success} />
          </View>
          <View style={styles.statTextGroup}>
            <Text style={styles.statLabel}>Income</Text>
            <AnimatedAmount
              value={income}
              style={[styles.statAmount, { color: COLORS.success }]}
            />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statBlock}>
          <View style={[styles.iconCircle, { backgroundColor: COLORS.danger + '22' }]}>
            <Ionicons name="arrow-up" size={16} color={COLORS.danger} />
          </View>
          <View style={styles.statTextGroup}>
            <Text style={styles.statLabel}>Expense</Text>
            <AnimatedAmount
              value={expense}
              style={[styles.statAmount, { color: COLORS.danger }]}
            />
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