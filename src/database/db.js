import * as SQLite from 'expo-sqlite';

// Open (or create) the database
const db = SQLite.openDatabaseSync('expenses.db');

// Initialize the table — call this once when app starts
export const initDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      note TEXT
    );
  `);
};

// CREATE — add a new transaction
export const addTransaction = (transaction) => {
  const { title, amount, type, category, date, note } = transaction;
  const result = db.runSync(
    `INSERT INTO transactions (title, amount, type, category, date, note)
     VALUES (?, ?, ?, ?, ?, ?);`,
    [title, amount, type, category, date, note || '']
  );
  return result.lastInsertRowId;
};

// READ — get all transactions, most recent first
export const getAllTransactions = () => {
  const rows = db.getAllSync(
    `SELECT * FROM transactions ORDER BY date DESC;`
  );
  return rows;
};

// READ — get a single transaction by id (useful for edit screen later)
export const getTransactionById = (id) => {
  const row = db.getFirstSync(
    `SELECT * FROM transactions WHERE id = ?;`,
    [id]
  );
  return row;
};

// UPDATE — edit an existing transaction
export const updateTransaction = (id, transaction) => {
  const { title, amount, type, category, date, note } = transaction;
  db.runSync(
    `UPDATE transactions
     SET title = ?, amount = ?, type = ?, category = ?, date = ?, note = ?
     WHERE id = ?;`,
    [title, amount, type, category, date, note || '', id]
  );
};

// DELETE — remove a transaction
export const deleteTransaction = (id) => {
  db.runSync(`DELETE FROM transactions WHERE id = ?;`, [id]);
};

// Helper — get totals for summary card (income, expense, balance)
export const getSummary = () => {
  const income = db.getFirstSync(
    `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'income';`
  );
  const expense = db.getFirstSync(
    `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'expense';`
  );
  return {
    income: income.total,
    expense: expense.total,
    balance: income.total - expense.total,
  };
};

// Helper — get totals grouped by category (for the Stats/chart screen)
export const getCategoryTotals = () => {
  const rows = db.getAllSync(
    `SELECT category, SUM(amount) as total
     FROM transactions
     WHERE type = 'expense'
     GROUP BY category
     ORDER BY total DESC;`
  );
  return rows;
};

export default db;