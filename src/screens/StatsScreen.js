import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import { useTransactions } from '../context/TransactionContext';
import { getCategoryByLabel } from '../constants/categories';
import MonthNavigator from '../components/MonthNavigator';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';

const screenWidth = Dimensions.get('window').width;

const StatsScreen = () => {
  const {
    categoryTotals,
    summary,
    selectedYear,
    selectedMonth,
    isPrevDisabled,
    isNextDisabled,
    goToPrevMonth,
    goToNextMonth,
  } = useTransactions();

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
        <Text style={styles.heading}>Expense Breakdown</Text>

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
  heading: {
    color: COLORS.textPrimary,
    fontSize: FONT.xxl,
    fontWeight: '700',
    marginBottom: SPACING.lg,
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
});