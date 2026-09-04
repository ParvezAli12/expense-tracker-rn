import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  initDatabase,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByMonth,
  getSummaryByMonth,
  getCategoryTotalsByMonth,
  setBudget,
  deleteBudget,
  getBudgetProgress,
} from '../database/db';

const TransactionContext = createContext(null);

const MAX_MONTHS_BACK = 60; // 5 years

export const TransactionProvider = ({ children }) => {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [categoryTotals, setCategoryTotals] = useState([]);
  const [budgetProgress, setBudgetProgress] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback((year = selectedYear, month = selectedMonth) => {
    setTransactions(getTransactionsByMonth(year, month));
    setSummary(getSummaryByMonth(year, month));
    setCategoryTotals(getCategoryTotalsByMonth(year, month));
    setBudgetProgress(getBudgetProgress(year, month));
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

  const isPrevDisabled = useMemo(() => {
    const today = new Date();
    const monthsDiff =
      (today.getFullYear() - selectedYear) * 12 + (today.getMonth() + 1 - selectedMonth);
    return monthsDiff >= MAX_MONTHS_BACK;
  }, [selectedYear, selectedMonth]);

  const isNextDisabled = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    return selectedYear === currentYear && selectedMonth === currentMonth;
  }, [selectedYear, selectedMonth]);

  // ----- Budget actions -----

  const saveBudget = useCallback((category, monthlyLimit) => {
    setBudget(category, monthlyLimit);
    refresh();
  }, [refresh]);

  const removeBudget = useCallback((category) => {
    deleteBudget(category);
    refresh();
  }, [refresh]);

  const value = {
    transactions,
    summary,
    categoryTotals,
    budgetProgress,
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
    saveBudget,
    removeBudget,
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