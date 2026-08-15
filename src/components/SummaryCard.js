import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
          <View style={[styles.iconCircle, { backgroundColor: '#00B89422' }]}>
            <Ionicons name="arrow-down" size={16} color="#00B894" />
          </View>
          <View>
            <Text style={styles.statLabel}>Income</Text>
            <Text style={[styles.statAmount, { color: '#00B894' }]}>
              Rs {income.toLocaleString('en-PK', { minimumFractionDigits: 0 })}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statBlock}>
          <View style={[styles.iconCircle, { backgroundColor: '#FF6B6B22' }]}>
            <Ionicons name="arrow-up" size={16} color="#FF6B6B" />
          </View>
          <View>
            <Text style={styles.statLabel}>Expense</Text>
            <Text style={[styles.statAmount, { color: '#FF6B6B' }]}>
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
    backgroundColor: '#2A2A3C',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
  },
  balanceLabel: {
    color: '#AAAAAA',
    fontSize: 13,
    marginBottom: 6,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: '#3A3A4C',
    marginHorizontal: 12,
  },
  statLabel: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  statAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});