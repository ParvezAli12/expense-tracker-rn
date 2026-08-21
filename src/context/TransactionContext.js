import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  initDatabase,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByMonth,
  getSummaryByMonth,
  getCategoryTotalsByMonth,
  getEarliestTransactionMonth,
} from '../database/db';

const TransactionContext = createContext(null);

export const TransactionProvider = ({ children }) => {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // 1-12

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [categoryTotals, setCategoryTotals] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [earliestMonth, setEarliestMonth] = useState(null); // ISO string or null

  // Pull fresh data for the currently selected month
  const refresh = useCallback((year = selectedYear, month = selectedMonth) => {
    setTransactions(getTransactionsByMonth(year, month));
    setSummary(getSummaryByMonth(year, month));
    setCategoryTotals(getCategoryTotalsByMonth(year, month));
    setEarliestMonth(getEarliestTransactionMonth());
  }, [selectedYear, selectedMonth]);

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

  // Move to the previous month (wraps year backward at January)
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

  // Move to the next month (wraps year forward at December)
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

  // Jump back to the current real-world month
  const goToCurrentMonth = useCallback(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    setSelectedYear(year);
    setSelectedMonth(month);
    refresh(year, month);
  }, [refresh]);

  // Whether "previous month" should be disabled — true once we've gone back
  // past the month of the earliest transaction in the database
  const isPrevDisabled = useMemo(() => {
    if (!earliestMonth) return true; // no transactions at all yet
    const earliest = new Date(earliestMonth);
    const earliestYear = earliest.getFullYear();
    const earliestMonthNum = earliest.getMonth() + 1;
    if (selectedYear < earliestYear) return true;
    if (selectedYear === earliestYear && selectedMonth <= earliestMonthNum) return true;
    return false;
  }, [earliestMonth, selectedYear, selectedMonth]);

  // Whether "next month" should be disabled — true once we're at the real current month
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