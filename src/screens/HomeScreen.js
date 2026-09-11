import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import SummaryCard from '../components/SummaryCard';
import TransactionItem from '../components/TransactionItem';
import MonthNavigator from '../components/MonthNavigator';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'income', label: 'Income' },
  { id: 'expense', label: 'Expense' },
];

const HomeScreen = ({ navigation }) => {
  const {
    transactions,
    summary,
    removeTransaction,
    selectedYear,
    selectedMonth,
    isPrevDisabled,
    isNextDisabled,
    goToPrevMonth,
    goToNextMonth,
    goToCurrentMonth,
  } = useTransactions();

  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesFilter = activeFilter === 'all' || t.type === activeFilter;
      const matchesSearch =
        searchText.trim() === '' ||
        t.title.toLowerCase().includes(searchText.toLowerCase()) ||
        t.category.toLowerCase().includes(searchText.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [transactions, searchText, activeFilter]);

  return (
    <SafeAreaView style={styles.container}>
      <MonthNavigator
        year={selectedYear}
        month={selectedMonth}
        isPrevDisabled={isPrevDisabled}
        isNextDisabled={isNextDisabled}
        onPrev={goToPrevMonth}
        onNext={goToNextMonth}
        onJumpToday={goToCurrentMonth}
        showJumpToday
      />

      <SummaryCard summary={summary} />

      <Text style={styles.sectionTitle}>Transactions</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={COLORS.textFaint} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          placeholderTextColor={COLORS.textFaint}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={18} color={COLORS.textFaint} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <TouchableOpacity
              key={filter.id}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onDelete={() => removeTransaction(item.id)}
            onPress={() => navigation.navigate('AddTransaction', { transaction: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={48} color="#555" />
            <Text style={styles.emptyText}>
              {transactions.length === 0 ? 'No transactions this month' : 'No matching transactions'}
            </Text>
            <Text style={styles.emptySubtext}>
              {transactions.length === 0 ? 'Tap + to add one' : 'Try a different search or filter'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    fontSize: FONT.xl,
    fontWeight: '600',
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xxl,
    marginBottom: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.xl,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONT.md,
    paddingVertical: SPACING.sm + 2,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm + 2,
    marginBottom: SPACING.md,
  },
  filterChip: {
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    color: COLORS.textSecondary,
    fontSize: FONT.base,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: COLORS.textPrimary,
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT.xl,
    marginTop: SPACING.md,
    fontWeight: '500',
  },
  emptySubtext: {
    color: COLORS.textFaint,
    fontSize: FONT.base,
    marginTop: SPACING.xs,
  },
});