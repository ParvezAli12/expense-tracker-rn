import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  initDatabase,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getAllTransactions,
  getSummary,
  getCategoryTotals,
} from '../database/db';

const TransactionContext = createContext(null);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [categoryTotals, setCategoryTotals] = useState([]);
  const [isReady, setIsReady] = useState(false);

  // Pull fresh data from SQLite into state — call after any write operation
  const refresh = useCallback(() => {
    setTransactions(getAllTransactions());
    setSummary(getSummary());
    setCategoryTotals(getCategoryTotals());
  }, []);

  // Run once when app starts — creates table, then loads initial data
  const setup = useCallback(() => {
    initDatabase();
    refresh();
    setIsReady(true);
  }, [refresh]);

  const createTransaction = useCallback((transaction) => {
    addTransaction(transaction);
    refresh();
  }, [refresh]);

  const editTransaction = useCallback((id, transaction) => {
    updateTransaction(id, transaction);
    refresh();
  }, [refresh]);

  const removeTransaction = useCallback((id) => {
    deleteTransaction(id);
    refresh();
  }, [refresh]);

  const value = {
    transactions,
    summary,
    categoryTotals,
    isReady,
    setup,
    refresh,
    createTransaction,
    editTransaction,
    removeTransaction,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook — so screens do `const { transactions } = useTransactions()` instead of importing useContext everywhere
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};