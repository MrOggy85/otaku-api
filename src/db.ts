import { DB } from "./deps.ts";

const CHALLENGES = {
  TABLE_NAME: 'CHALLENGES',
  COLUMN_ID: 'id',
  COLUMN_NAME: 'name',
  COLUMN_KEY: 'key',
}

type Challenge = {
  id: number;
  name: string;
  key: string;
}

const DB_NAME = "./test.db";

let db: DB | null = null;
function getDB() {
  if (!db) {
    db = new DB(DB_NAME);
  }
  return db;
}

export function initDB() {
  const db = getDB();

  // Challenges
  db.query(
    `CREATE TABLE IF NOT EXISTS ${CHALLENGES.TABLE_NAME} ` +
    "(" +
    `${CHALLENGES.COLUMN_ID} INTEGER PRIMARY KEY AUTOINCREMENT, ` +
    `${CHALLENGES.COLUMN_NAME} TEXT,` +
    `${CHALLENGES.COLUMN_KEY} TEXT` +
    ")"
  );
}

// deno-lint-ignore no-explicit-any
function mapRowToChallenge(row: any[]) {
  const [id, name, key] = row;

  const challenge: Challenge = {
    id,
    name,
    key,
  };

  return challenge;
}

export function getChallenges() {
  const db = getDB();
  const rows = db.query(`SELECT * FROM ${CHALLENGES.TABLE_NAME}`);

  const challenges: Challenge[] = [];
  for (const row of rows) {
    const challenge = mapRowToChallenge(row);
    challenges.push(challenge);
  }

  return challenges;
}

export function getChallengeByKey(byKey: Challenge['key']) {
  const db = getDB();
  const query =
    `SELECT * FROM ${CHALLENGES.TABLE_NAME} ` +
    `WHERE ${CHALLENGES.COLUMN_KEY} = '${byKey}'`
  const result = db.query(query);

  const firstResult = result.next();
  console.log('firstResult', firstResult.value);
  const nextRow = result.next();

  if (!nextRow.done) {
    console.warn('Multiple keys found');
  }

  const firstRow = firstResult.value;
  if (!firstRow) {
    return null;
  }

  const challenge = mapRowToChallenge(firstRow);

  return challenge;
}

type ChallengeInsert = Omit<Challenge, 'id'>;

export function insertChallenge(challenge: ChallengeInsert) {
  console.log('insertChallenge...', challenge);
  const db = getDB();
  db.query(
    `INSERT INTO ${CHALLENGES.TABLE_NAME} ` +
    `(` +
    `${CHALLENGES.COLUMN_NAME}, ` +
    `${CHALLENGES.COLUMN_KEY}` +
    `) VALUES (?,?)`,
    [
      challenge.name,
      challenge.key,
    ],
  );
}
