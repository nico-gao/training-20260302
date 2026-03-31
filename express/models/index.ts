import path from "node:path";
import { mkdir } from "node:fs/promises";
import crypto from "node:crypto";

import { open, type Database } from "sqlite";
import sqlite3 from "sqlite3";

export interface User {
  id: string;
  email: string;
  password: string;
}

export interface List {
  id: string;
  name: string;
}

export interface Todo {
  id: string;
  listId: string;
  name: string;
  completed: boolean;
}

const defaultDatabasePath = path.join(process.cwd(), "data", "app.sqlite");
const databasePath = process.env.SQLITE_DB_PATH ?? defaultDatabasePath;

let databasePromise: Promise<Database<sqlite3.Database, sqlite3.Statement>> | null =
  null;

const getDb = async (): Promise<Database<sqlite3.Database, sqlite3.Statement>> => {
  if (!databasePromise) {
    databasePromise = initializeDatabase();
  }

  return databasePromise;
};

const initializeDatabase = async (): Promise<
  Database<sqlite3.Database, sqlite3.Statement>
> => {
  await mkdir(path.dirname(databasePath), { recursive: true });

  const db = await open({
    filename: databasePath,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lists (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      list_id TEXT NOT NULL,
      name TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
    );
  `);

  return db;
};

const findUserByEmail = async (email: string): Promise<User | undefined> => {
  const db = await getDb();

  const user = await db.get<User>(
    "SELECT id, email, password FROM users WHERE email = ?",
    email,
  );

  return user ?? undefined;
};

const insertUser = async (email: string, password: string): Promise<User> => {
  const db = await getDb();
  const user: User = {
    id: crypto.randomUUID(),
    email,
    password,
  };

  await db.run(
    "INSERT INTO users (id, email, password) VALUES (?, ?, ?)",
    user.id,
    user.email,
    user.password,
  );

  return user;
};

const getLists = async (): Promise<List[]> => {
  const db = await getDb();

  return db.all<List[]>("SELECT id, name FROM lists ORDER BY rowid ASC");
};

const createListRecord = async (name: string): Promise<List> => {
  const db = await getDb();
  const list: List = {
    id: crypto.randomUUID(),
    name,
  };

  await db.run("INSERT INTO lists (id, name) VALUES (?, ?)", list.id, list.name);

  return list;
};

const findListById = async (id: string): Promise<List | undefined> => {
  const db = await getDb();

  const list = await db.get<List>(
    "SELECT id, name FROM lists WHERE id = ?",
    id,
  );

  return list ?? undefined;
};

const updateListName = async (id: string, name: string): Promise<List | undefined> => {
  const db = await getDb();

  const result = await db.run("UPDATE lists SET name = ? WHERE id = ?", name, id);

  if (result.changes === 0) {
    return undefined;
  }

  return findListById(id);
};

const resetDatabase = async (): Promise<void> => {
  const db = await getDb();

  await db.exec(`
    DELETE FROM todos;
    DELETE FROM lists;
    DELETE FROM users;
  `);
};

export {
  createListRecord,
  findListById,
  findUserByEmail,
  getDb,
  getLists,
  insertUser,
  resetDatabase,
  updateListName,
};
