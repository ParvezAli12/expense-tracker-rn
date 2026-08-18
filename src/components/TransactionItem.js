import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCategoryByLabel } from '../constants/categories';

const TransactionItem = ({ transaction, onDelete, onPress }) => {
  const { title, amount, type, category, date, note } = transaction;
  const categoryData = getCategoryByLabel(category, type);
  const isExpense = type === 'expense';

  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });

  const handleLongPress = () => {
    Alert.alert(
      'Delete Transaction',
      `Delete "${title}"? This can't be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconCircle, { backgroundColor: categoryData.color + '22' }]}>
        <Ionicons name={categoryData.icon} size={20} color={categoryData.color} />
      </View>

      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.subtitle}>{category} · {formattedDate}</Text>
        {note ? <Text style={styles.note} numberOfLines={1}>{note}</Text> : null}
      </View>

      <Text style={[styles.amount, { color: isExpense ? '#FF6B6B' : '#00B894' }]}>
        {isExpense ? '-' : '+'}Rs {amount.toLocaleString('en-PK')}
      </Text>
    </TouchableOpacity>
  );
};

export default TransactionItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A3C',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    color: '#AAAAAA',
    fontSize: 12,
    marginTop: 2,
  },
  note: {
    color: '#777777',
    fontSize: 11,
    marginTop: 2,
    fontStyle: 'italic',
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
});