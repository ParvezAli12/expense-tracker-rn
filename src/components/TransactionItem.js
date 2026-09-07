import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { getCategoryByLabel } from '../constants/categories';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';
import { hapticMedium } from '../utils/haptics';

const TransactionItem = ({ transaction, onDelete, onPress }) => {
  const { title, amount, type, category, date, note } = transaction;
  const categoryData = getCategoryByLabel(category, type);
  const isExpense = type === 'expense';
  const amountColor = isExpense ? COLORS.danger : COLORS.success;
  const swipeableRef = useRef(null);

  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });

  const handleDeleteConfirm = () => {
    Alert.alert(
      'Delete Transaction',
      `Delete "${title}"? This can't be undone.`,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => swipeableRef.current?.close() },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            swipeableRef.current?.close();
            hapticMedium();
            onDelete();
          },
        },
      ]
    );
  };

  // Renders the red delete panel that slides in from the right as you swipe
  const renderRightActions = (progress, dragX) => {
    const translateX = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [0, 80],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={handleDeleteConfirm} style={styles.deleteAction}>
        <Animated.View style={[styles.deleteContent, { transform: [{ translateX }] }]}>
          <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
          <Text style={styles.deleteText}>Delete</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      rightThreshold={40}
    >
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.iconCircle, { backgroundColor: categoryData.color + '22' }]}>
          <Ionicons name={categoryData.icon} size={20} color={categoryData.color} />
        </View>

        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{category} · {formattedDate}</Text>
          {note ? <Text style={styles.note} numberOfLines={1}>{note}</Text> : null}
        </View>

        <Text style={[styles.amount, { color: amountColor }]} numberOfLines={1}>
          {isExpense ? '-' : '+'}Rs {amount.toLocaleString('en-PK')}
        </Text>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default TransactionItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg - 2,
    marginBottom: SPACING.md - 2,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  details: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT.lg,
    fontWeight: '600',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT.sm,
    marginTop: 2,
  },
  note: {
    color: COLORS.textMuted,
    fontSize: FONT.xs,
    marginTop: 2,
    fontStyle: 'italic',
  },
  amount: {
    fontSize: FONT.md,
    fontWeight: '700',
    flexShrink: 0,
  },
  deleteAction: {
    backgroundColor: COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md - 2,
  },
  deleteContent: {
    alignItems: 'center',
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: FONT.xs,
    fontWeight: '600',
    marginTop: 2,
  },
});