import { DB } from "../deps.ts";

const DB_NAME = "./test.db";

let db: DB | null = null;
function getDB() {
  if (!db) {
    db = new DB(DB_NAME);
  }
  return db;
}

type Query = DB['query']
type Q1 = Parameters<Query>[0];
type Q2 = Parameters<Query>[1];

export function runQuery(query: Q1, values?: Q2) {
  const db = getDB();
  const rows = db.query(query, values);
  return rows;
}
