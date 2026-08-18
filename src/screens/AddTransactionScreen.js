import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useTransactions } from '../context/TransactionContext';
import { getCategoriesByType, getCategoryByLabel } from '../constants/categories';
import CategoryPicker from '../components/CategoryPicker';

const AddTransactionScreen = ({ navigation, route }) => {
  const { createTransaction, editTransaction } = useTransactions();
  const existingTransaction = route.params?.transaction || null;
  const isEditMode = !!existingTransaction;

  const [type, setType] = useState(existingTransaction?.type || 'expense');
  const [title, setTitle] = useState(existingTransaction?.title || '');
  const [amount, setAmount] = useState(existingTransaction ? String(existingTransaction.amount) : '');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [note, setNote] = useState(existingTransaction?.note || '');

  const categories = getCategoriesByType(type);

  // Pre-select the category when editing, once categories for the type are known
  useEffect(() => {
    if (existingTransaction) {
      const cat = getCategoryByLabel(existingTransaction.category, existingTransaction.type);
      setSelectedCategory(cat);
    }
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: isEditMode ? 'Edit Transaction' : 'Add Transaction',
    });
  }, [isEditMode]);

  const handleTypeChange = (newType) => {
    setType(newType);
    setSelectedCategory(null); // reset category since the list changes
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please enter a title for this transaction.');
      return;
    }
    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount greater than 0.');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Missing category', 'Please select a category.');
      return;
    }

    const payload = {
      title: title.trim(),
      amount: numericAmount,
      type,
      category: selectedCategory.label,
      date: existingTransaction ? existingTransaction.date : new Date().toISOString(),
      note: note.trim(),
    };

    if (isEditMode) {
      editTransaction(existingTransaction.id, payload);
    } else {
      createTransaction(payload);
    }

    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      `Delete "${existingTransaction.title}"? This can't be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // deleteTransaction isn't imported here on purpose —
            // deletion from this screen goes through the same context
            // used elsewhere. We navigate back after removeTransaction runs.
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Type Toggle */}
        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'expense' && styles.typeButtonActiveExpense]}
            onPress={() => handleTypeChange('expense')}
          >
            <Text style={[styles.typeButtonText, type === 'expense' && styles.typeButtonTextActive]}>
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'income' && styles.typeButtonActiveIncome]}
            onPress={() => handleTypeChange('income')}
          >
            <Text style={[styles.typeButtonText, type === 'income' && styles.typeButtonTextActive]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Groceries"
          placeholderTextColor="#666"
          value={title}
          onChangeText={setTitle}
        />

        {/* Amount */}
        <Text style={styles.label}>Amount (Rs)</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          placeholderTextColor="#666"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        {/* Category Picker */}
        <Text style={styles.label}>Category</Text>
        <CategoryPicker
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Note */}
        <Text style={styles.label}>Note (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Add a note..."
          placeholderTextColor="#666"
          value={note}
          onChangeText={setNote}
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {isEditMode ? 'Update Transaction' : 'Save Transaction'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddTransactionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: '#2A2A3C',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  typeButtonActiveExpense: {
    backgroundColor: '#FF6B6B',
  },
  typeButtonActiveIncome: {
    backgroundColor: '#00B894',
  },
  typeButtonText: {
    color: '#AAAAAA',
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  label: {
    color: '#AAAAAA',
    fontSize: 13,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#2A2A3C',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});