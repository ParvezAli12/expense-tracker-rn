import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import { getCategoryByLabel, EXPENSE_CATEGORIES } from '../constants/categories';
import MonthNavigator from '../components/MonthNavigator';
import BudgetCard from '../components/BudgetCard';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';

const screenWidth = Dimensions.get('window').width;

const StatsScreen = () => {
  const {
    categoryTotals,
    summary,
    budgetProgress,
    selectedYear,
    selectedMonth,
    isPrevDisabled,
    isNextDisabled,
    goToPrevMonth,
    goToNextMonth,
    saveBudget,
    removeBudget,
  } = useTransactions();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [limitInput, setLimitInput] = useState('');

  const hasData = categoryTotals.length > 0;

  const chartData = categoryTotals.map((item) => {
    const categoryData = getCategoryByLabel(item.category, 'expense');
    return {
      name: item.category,
      population: item.total,
      color: categoryData.color,
      legendFontColor: '#CCCCCC',
      legendFontSize: 12,
    };
  });

  // Categories that don't have a budget set yet — offered in the "Add" modal
  const budgetedCategoryNames = budgetProgress.map((b) => b.category);
  const availableCategories = EXPENSE_CATEGORIES.filter(
    (c) => !budgetedCategoryNames.includes(c.label)
  );

  const openAddModal = () => {
    setSelectedCategory(null);
    setLimitInput('');
    setModalVisible(true);
  };

  const openEditModal = (budget) => {
    const cat = getCategoryByLabel(budget.category, 'expense');
    setSelectedCategory(cat);
    setLimitInput(String(budget.limit));
    setModalVisible(true);
  };

  const handleSaveBudget = () => {
    if (!selectedCategory) {
      Alert.alert('Missing category', 'Please select a category.');
      return;
    }
    const numericLimit = parseFloat(limitInput);
    if (!limitInput || isNaN(numericLimit) || numericLimit <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid monthly limit greater than 0.');
      return;
    }
    saveBudget(selectedCategory.label, numericLimit);
    setModalVisible(false);
  };

  const handleLongPressBudget = (budget) => {
    Alert.alert(
      'Remove Budget',
      `Remove the budget for "${budget.category}"? This won't delete any transactions.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeBudget(budget.category) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <MonthNavigator
        year={selectedYear}
        month={selectedMonth}
        isPrevDisabled={isPrevDisabled}
        isNextDisabled={isNextDisabled}
        onPrev={goToPrevMonth}
        onNext={goToNextMonth}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Budgets Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.heading}>Budgets</Text>
          <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
            <Ionicons name="add" size={16} color={COLORS.primary} />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {budgetProgress.length === 0 ? (
          <View style={styles.noBudgetsBox}>
            <Ionicons name="wallet-outline" size={28} color="#555" />
            <Text style={styles.noBudgetsText}>No budgets set for this month</Text>
            <Text style={styles.noBudgetsSubtext}>Tap "Add" to set a spending limit for a category</Text>
          </View>
        ) : (
          budgetProgress.map((budget) => (
            <BudgetCard
              key={budget.category}
              budget={budget}
              onPress={() => openEditModal(budget)}
              onLongPress={() => handleLongPressBudget(budget)}
            />
          ))
        )}

        {/* Expense Breakdown Section */}
        <Text style={[styles.heading, styles.chartHeading]}>Expense Breakdown</Text>

        {hasData ? (
          <View style={styles.chartWrapper}>
            <PieChart
              data={chartData}
              width={screenWidth - SPACING.xl * 2}
              height={220}
              chartConfig={{ color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})` }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No expenses this month</Text>
          </View>
        )}

        <View style={styles.listSection}>
          <Text style={styles.listHeading}>By Category</Text>
          {categoryTotals.length === 0 ? (
            <Text style={styles.noCategoryText}>Nothing to show here yet</Text>
          ) : (
            categoryTotals.map((item) => {
              const categoryData = getCategoryByLabel(item.category, 'expense');
              const percentage = summary.expense > 0
                ? ((item.total / summary.expense) * 100).toFixed(1)
                : 0;

              return (
                <View key={item.category} style={styles.row}>
                  <View style={styles.rowLeft}>
                    <View style={[styles.dot, { backgroundColor: categoryData.color }]} />
                    <Text style={styles.rowLabel}>{item.category}</Text>
                  </View>
                  <View style={styles.rowRight}>
                    <Text style={styles.rowAmount}>Rs {item.total.toLocaleString('en-PK')}</Text>
                    <Text style={styles.rowPercent}>{percentage}%</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Set/Edit Budget Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {selectedCategory ? `Budget for ${selectedCategory.label}` : 'Set Budget'}
            </Text>

            {!selectedCategory ? (
              <>
                <Text style={styles.modalSubLabel}>Choose a category</Text>
                <View style={styles.categoryGrid}>
                  {availableCategories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={styles.categoryChip}
                      onPress={() => setSelectedCategory(cat)}
                    >
                      <Ionicons name={cat.icon} size={14} color={cat.color} />
                      <Text style={styles.categoryChipText}>{cat.label}</Text>
                    </TouchableOpacity>
                  ))}
                  {availableCategories.length === 0 && (
                    <Text style={styles.noCategoryText}>All categories already have a budget</Text>
                  )}
                </View>
              </>
            ) : (
              <>
                <Text style={styles.modalSubLabel}>Monthly limit (Rs)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. 15000"
                  placeholderTextColor={COLORS.textFaint}
                  value={limitInput}
                  onChangeText={setLimitInput}
                  keyboardType="numeric"
                  autoFocus
                />
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              {selectedCategory && (
                <TouchableOpacity style={[styles.modalButton, styles.modalSaveButton]} onPress={handleSaveBudget}>
                  <Text style={styles.modalSaveText}>Save</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.xl,
    paddingBottom: 60,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  heading: {
    color: COLORS.textPrimary,
    fontSize: FONT.xxl,
    fontWeight: '700',
  },
  chartHeading: {
    marginTop: SPACING.xxl + 4,
    marginBottom: SPACING.lg,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: FONT.base,
    fontWeight: '600',
  },
  noBudgetsBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  noBudgetsText: {
    color: COLORS.textSecondary,
    fontSize: FONT.md,
    fontWeight: '500',
    marginTop: SPACING.sm + 2,
  },
  noBudgetsSubtext: {
    color: COLORS.textFaint,
    fontSize: FONT.sm,
    marginTop: 4,
    textAlign: 'center',
  },
  chartWrapper: {
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: FONT.md,
  },
  listSection: {
    marginTop: SPACING.xxl + 4,
  },
  listHeading: {
    color: COLORS.textSecondary,
    fontSize: FONT.base,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  noCategoryText: {
    color: COLORS.textFaint,
    fontSize: FONT.base,
    textAlign: 'center',
    paddingVertical: SPACING.xxl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg - 2,
    marginBottom: SPACING.sm,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 2,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  rowLabel: {
    color: COLORS.textPrimary,
    fontSize: FONT.md,
    fontWeight: '500',
  },
  rowRight: {
    alignItems: 'flex-end',
  },
  rowAmount: {
    color: COLORS.textPrimary,
    fontSize: FONT.md,
    fontWeight: '600',
  },
  rowPercent: {
    color: COLORS.textMuted,
    fontSize: FONT.sm,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    width: '88%',
    maxHeight: '75%',
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT.xxl,
    fontWeight: '700',
    marginBottom: SPACING.lg,
  },
  modalSubLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT.base,
    marginBottom: SPACING.sm + 2,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipText: {
    color: COLORS.textSecondary,
    fontSize: FONT.sm,
    fontWeight: '500',
  },
  modalInput: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.lg - 2,
    color: COLORS.textPrimary,
    fontSize: FONT.lg,
    marginBottom: SPACING.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
  },
  modalButton: {
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.sm,
  },
  modalCancelButton: {
    backgroundColor: 'transparent',
  },
  modalCancelText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  modalSaveButton: {
    backgroundColor: COLORS.primary,
  },
  modalSaveText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
});