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

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Transactions</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={18} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter chips */}
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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A3C',
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    paddingVertical: 10,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 12,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#2A2A3C',
    borderWidth: 1,
    borderColor: '#3A3A4C',
  },
  filterChipActive: {
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  filterChipText: {
    color: '#AAAAAA',
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#AAAAAA',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
  emptySubtext: {
    color: '#666666',
    fontSize: 13,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});