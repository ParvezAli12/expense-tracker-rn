import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTransactions } from '../context/TransactionContext';
import SummaryCard from '../components/SummaryCard';
import TransactionItem from '../components/TransactionItem';

const HomeScreen = ({ navigation }) => {
  const { transactions, summary, removeTransaction } = useTransactions();

  return (
    <SafeAreaView style={styles.container}>
      <SummaryCard summary={summary} />

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Recent Transactions</Text>
        <View style={styles.headerLinks}>
          <TouchableOpacity onPress={() => navigation.navigate('People')}>
            <Text style={styles.statsLink}>Borrow & Lend</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Stats')}>
            <Text style={styles.statsLink}>View Stats</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onDelete={() => removeTransaction(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={48} color="#555" />
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptySubtext}>Tap + to add your first one</Text>
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
  headerLinks: {
    flexDirection: 'row',
    gap: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsLink: {
    fontSize: 14,
    color: '#6C5CE7',
    fontWeight: '500',
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