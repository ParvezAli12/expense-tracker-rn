import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('expenses.db');

// Initialize all tables — call this once when app starts
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

  db.execSync(`
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      note TEXT
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS ious (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      person_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      direction TEXT NOT NULL,
      date TEXT NOT NULL,
      due_date TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      note TEXT,
      FOREIGN KEY (person_id) REFERENCES people (id)
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS budgets (
      category TEXT PRIMARY KEY,
      monthly_limit REAL NOT NULL
    );
  `);
};

// ===== TRANSACTIONS =====

export const addTransaction = (transaction) => {
  const { title, amount, type, category, date, note } = transaction;
  const result = db.runSync(
    `INSERT INTO transactions (title, amount, type, category, date, note)
     VALUES (?, ?, ?, ?, ?, ?);`,
    [title, amount, type, category, date, note || '']
  );
  return result.lastInsertRowId;
};

export const getAllTransactions = () => {
  return db.getAllSync(`SELECT * FROM transactions ORDER BY date DESC;`);
};

export const getTransactionById = (id) => {
  return db.getFirstSync(`SELECT * FROM transactions WHERE id = ?;`, [id]);
};

export const updateTransaction = (id, transaction) => {
  const { title, amount, type, category, date, note } = transaction;
  db.runSync(
    `UPDATE transactions
     SET title = ?, amount = ?, type = ?, category = ?, date = ?, note = ?
     WHERE id = ?;`,
    [title, amount, type, category, date, note || '', id]
  );
};

export const deleteTransaction = (id) => {
  db.runSync(`DELETE FROM transactions WHERE id = ?;`, [id]);
};

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

export const getCategoryTotals = () => {
  return db.getAllSync(
    `SELECT category, SUM(amount) as total
     FROM transactions
     WHERE type = 'expense'
     GROUP BY category
     ORDER BY total DESC;`
  );
};

// ===== MONTH-SCOPED QUERIES =====

const formatYearMonth = (year, month) => {
  const paddedMonth = String(month).padStart(2, '0');
  return `${year}-${paddedMonth}`;
};

export const getTransactionsByMonth = (year, month) => {
  const yearMonth = formatYearMonth(year, month);
  return db.getAllSync(
    `SELECT * FROM transactions
     WHERE strftime('%Y-%m', date) = ?
     ORDER BY date DESC;`,
    [yearMonth]
  );
};

export const getSummaryByMonth = (year, month) => {
  const yearMonth = formatYearMonth(year, month);
  const income = db.getFirstSync(
    `SELECT COALESCE(SUM(amount), 0) as total FROM transactions
     WHERE type = 'income' AND strftime('%Y-%m', date) = ?;`,
    [yearMonth]
  );
  const expense = db.getFirstSync(
    `SELECT COALESCE(SUM(amount), 0) as total FROM transactions
     WHERE type = 'expense' AND strftime('%Y-%m', date) = ?;`,
    [yearMonth]
  );
  return {
    income: income.total,
    expense: expense.total,
    balance: income.total - expense.total,
  };
};

export const getCategoryTotalsByMonth = (year, month) => {
  const yearMonth = formatYearMonth(year, month);
  return db.getAllSync(
    `SELECT category, SUM(amount) as total
     FROM transactions
     WHERE type = 'expense' AND strftime('%Y-%m', date) = ?
     GROUP BY category
     ORDER BY total DESC;`,
    [yearMonth]
  );
};

export const getEarliestTransactionMonth = () => {
  const row = db.getFirstSync(`SELECT MIN(date) as earliest FROM transactions;`);
  return row.earliest;
};

// ===== BORROW/LEND (IOU) FEATURE =====

export const addPerson = (person) => {
  const { name, note } = person;
  const result = db.runSync(
    `INSERT INTO people (name, note) VALUES (?, ?);`,
    [name, note || '']
  );
  return result.lastInsertRowId;
};

export const getAllPeople = () => {
  return db.getAllSync(`SELECT * FROM people ORDER BY name ASC;`);
};

export const deletePerson = (id) => {
  db.runSync(`DELETE FROM ious WHERE person_id = ?;`, [id]);
  db.runSync(`DELETE FROM people WHERE id = ?;`, [id]);
};

export const addIou = (iou) => {
  const { person_id, amount, direction, date, due_date, note } = iou;
  const result = db.runSync(
    `INSERT INTO ious (person_id, amount, direction, date, due_date, status, note)
     VALUES (?, ?, ?, ?, ?, 'pending', ?);`,
    [person_id, amount, direction, date, due_date || null, note || '']
  );
  return result.lastInsertRowId;
};

export const getIousByPerson = (personId) => {
  return db.getAllSync(
    `SELECT * FROM ious WHERE person_id = ? ORDER BY date DESC;`,
    [personId]
  );
};

export const settleIou = (id) => {
  db.runSync(`UPDATE ious SET status = 'settled' WHERE id = ?;`, [id]);
};

export const deleteIou = (id) => {
  db.runSync(`DELETE FROM ious WHERE id = ?;`, [id]);
};

export const getPersonBalance = (personId) => {
  const lent = db.getFirstSync(
    `SELECT COALESCE(SUM(amount), 0) as total FROM ious
     WHERE person_id = ? AND direction = 'lent' AND status = 'pending';`,
    [personId]
  );
  const borrowed = db.getFirstSync(
    `SELECT COALESCE(SUM(amount), 0) as total FROM ious
     WHERE person_id = ? AND direction = 'borrowed' AND status = 'pending';`,
    [personId]
  );
  return lent.total - borrowed.total;
};

export const getAllPeopleWithBalances = () => {
  const people = getAllPeople();
  return people.map((person) => ({
    ...person,
    balance: getPersonBalance(person.id),
  }));
};

export const getOverallIouSummary = () => {
  const owedToYou = db.getFirstSync(
    `SELECT COALESCE(SUM(amount), 0) as total FROM ious
     WHERE direction = 'lent' AND status = 'pending';`
  );
  const youOwe = db.getFirstSync(
    `SELECT COALESCE(SUM(amount), 0) as total FROM ious
     WHERE direction = 'borrowed' AND status = 'pending';`
  );
  return {
    owedToYou: owedToYou.total,
    youOwe: youOwe.total,
  };
};

// ===== BUDGETS =====

export const setBudget = (category, monthlyLimit) => {
  db.runSync(
    `INSERT OR REPLACE INTO budgets (category, monthly_limit) VALUES (?, ?);`,
    [category, monthlyLimit]
  );
};

export const getAllBudgets = () => {
  return db.getAllSync(`SELECT * FROM budgets;`);
};

export const deleteBudget = (category) => {
  db.runSync(`DELETE FROM budgets WHERE category = ?;`, [category]);
};

export const getBudgetProgress = (year, month) => {
  const paddedMonth = String(month).padStart(2, '0');
  const yearMonth = `${year}-${paddedMonth}`;

  const spent = db.getAllSync(
    `SELECT category, SUM(amount) as total
     FROM transactions
     WHERE type = 'expense' AND strftime('%Y-%m', date) = ?
     GROUP BY category;`,
    [yearMonth]
  );

  const budgets = getAllBudgets();

  return budgets.map((budget) => {
    const spentRow = spent.find((s) => s.category === budget.category);
    const spentAmount = spentRow ? spentRow.total : 0;
    return {
      category: budget.category,
      limit: budget.monthly_limit,
      spent: spentAmount,
      percentage: budget.monthly_limit > 0 ? (spentAmount / budget.monthly_limit) * 100 : 0,
    };
  });
};

export default db;