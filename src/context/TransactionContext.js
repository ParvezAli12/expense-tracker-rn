import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  initDatabase,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByMonth,
  getSummaryByMonth,
  getCategoryTotalsByMonth,
} from '../database/db';

const TransactionContext = createContext(null);

// How far back a user can browse — generous enough for real use, prevents infinite scrolling
const MAX_MONTHS_BACK = 60; // 5 years

export const TransactionProvider = ({ children }) => {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // 1-12

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [categoryTotals, setCategoryTotals] = useState([]);
  const [isReady, setIsReady] = useState(false);

  // Pull fresh data for the currently selected month
  const refresh = useCallback((year = selectedYear, month = selectedMonth) => {
    setTransactions(getTransactionsByMonth(year, month));
    setSummary(getSummaryByMonth(year, month));
    setCategoryTotals(getCategoryTotalsByMonth(year, month));
  }, [selectedYear, selectedMonth]);

  // Always starts on today's real year/month — fresh every app launch since
  // this state is initialized from `new Date()` above, not persisted anywhere
  const setup = useCallback(() => {
    initDatabase();
    refresh(selectedYear, selectedMonth);
    setIsReady(true);
  }, [refresh, selectedYear, selectedMonth]);

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

  const goToPrevMonth = useCallback(() => {
    let newYear = selectedYear;
    let newMonth = selectedMonth - 1;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    setSelectedYear(newYear);
    setSelectedMonth(newMonth);
    refresh(newYear, newMonth);
  }, [selectedYear, selectedMonth, refresh]);

  const goToNextMonth = useCallback(() => {
    let newYear = selectedYear;
    let newMonth = selectedMonth + 1;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setSelectedYear(newYear);
    setSelectedMonth(newMonth);
    refresh(newYear, newMonth);
  }, [selectedYear, selectedMonth, refresh]);

  const goToCurrentMonth = useCallback(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    setSelectedYear(year);
    setSelectedMonth(month);
    refresh(year, month);
  }, [refresh]);

  // Prev is disabled only after a generous 5-year lookback — not tied to
  // whether data exists, so you can always browse to an empty past month
  const isPrevDisabled = useMemo(() => {
    const today = new Date();
    const monthsDiff =
      (today.getFullYear() - selectedYear) * 12 + (today.getMonth() + 1 - selectedMonth);
    return monthsDiff >= MAX_MONTHS_BACK;
  }, [selectedYear, selectedMonth]);

  // Next is disabled once we're at the real current month — no future browsing
  const isNextDisabled = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    return selectedYear === currentYear && selectedMonth === currentMonth;
  }, [selectedYear, selectedMonth]);

  const value = {
    transactions,
    summary,
    categoryTotals,
    isReady,
    selectedYear,
    selectedMonth,
    isPrevDisabled,
    isNextDisabled,
    setup,
    refresh,
    createTransaction,
    editTransaction,
    removeTransaction,
    goToPrevMonth,
    goToNextMonth,
    goToCurrentMonth,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};