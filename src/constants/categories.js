export const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Food', icon: 'fast-food-outline', color: '#FF6B6B' },
  { id: 'transport', label: 'Transport', icon: 'car-outline', color: '#4ECDC4' },
  { id: 'shopping', label: 'Shopping', icon: 'bag-outline', color: '#FFD93D' },
  { id: 'bills', label: 'Bills', icon: 'receipt-outline', color: '#6C5CE7' },
  { id: 'entertainment', label: 'Entertainment', icon: 'film-outline', color: '#FF8CC6' },
  { id: 'health', label: 'Health', icon: 'medkit-outline', color: '#00B894' },
  { id: 'education', label: 'Education', icon: 'school-outline', color: '#0984E3' },
  { id: 'other', label: 'Other', icon: 'ellipsis-horizontal-outline', color: '#95A5A6' },
];

export const INCOME_CATEGORIES = [
  { id: 'salary', label: 'Salary', icon: 'cash-outline', color: '#00B894' },
  { id: 'freelance', label: 'Freelance', icon: 'laptop-outline', color: '#0984E3' },
  { id: 'gift', label: 'Gift', icon: 'gift-outline', color: '#FF8CC6' },
  { id: 'other', label: 'Other', icon: 'ellipsis-horizontal-outline', color: '#95A5A6' },
];

// Helper — find a category object by its label (used when rendering saved transactions)
export const getCategoryByLabel = (label, type) => {
  const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  return list.find((cat) => cat.label === label) || list[list.length - 1]; // fallback to "Other"
};

// Helper — get all categories for a given type
export const getCategoriesByType = (type) => {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
};