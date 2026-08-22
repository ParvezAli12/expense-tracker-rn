import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import { useTransactions } from '../context/TransactionContext';
import { getCategoryByLabel } from '../constants/categories';
import MonthNavigator from '../components/MonthNavigator';

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

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Expense Breakdown</Text>

        {hasData ? (
          <PieChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
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
    backgroundColor: '#1E1E2E',
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#777777',
    fontSize: 14,
  },
  listSection: {
    marginTop: 28,
  },
  listHeading: {
    color: '#AAAAAA',
    fontSize: 13,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  noCategoryText: {
    color: '#666666',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A2A3C',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  rowLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  rowRight: {
    alignItems: 'flex-end',
  },
  rowAmount: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  rowPercent: {
    color: '#888888',
    fontSize: 12,
    marginTop: 2,
  },
});