import * as SQLite from 'expo-sqlite';

// Open (or create) the database
const db = SQLite.openDatabaseSync('expenses.db');

// Initialize the tables — call this once when app starts
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
};

// ===== TRANSACTIONS =====

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

// ===== BORROW/LEND (IOU) FEATURE =====

// ----- People CRUD -----

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

// ----- IOU CRUD -----

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

// ----- Balance helpers -----

// Net balance for one person: positive = they owe you, negative = you owe them
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

// All people with their computed balance — powers the People list screen
export const getAllPeopleWithBalances = () => {
  const people = getAllPeople();
  return people.map((person) => ({
    ...person,
    balance: getPersonBalance(person.id),
  }));
};

// Overall totals across everyone — useful for a summary card on the People screen
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

export default db;