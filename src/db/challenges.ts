import { get } from "../debug/env.ts";
import { runQuery } from "./db.ts";

const TABLE = {
  NAME: 'CHALLENGES',
  COLUMN: {
    ID: 'id',
    NAME: 'name',
    KEY: 'key',
  },
}

type Challenge = {
  id: number;
  name: string;
  key: string;
}

export function createTable() {
  const query =
    `CREATE TABLE IF NOT EXISTS ${TABLE.NAME} ` +
    "(" +
    `${TABLE.COLUMN.ID} INTEGER PRIMARY KEY AUTOINCREMENT, ` +
    `${TABLE.COLUMN.NAME} TEXT NOT NULL,` +
    `${TABLE.COLUMN.KEY} TEXT NOT NULL` +
    ")";

    if (get('DB_LOG_QUERY')) {
      console.log(`${TABLE.NAME} create\n`, query);
    }
    runQuery(query);
}

// deno-lint-ignore no-explicit-any
function mapRowToModel(row: any[]) {
  const [id, name, key] = row;

  const challenge: Challenge = {
    id,
    name,
    key,
  };

  return challenge;
}

export function getAll() {
  const query =`SELECT * FROM ${TABLE.NAME}`;
  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE.NAME} getChallenges\n`, query);
  }
  const rows = runQuery(query);

  const challenges: Challenge[] = [];
  for (const row of rows) {
    const challenge = mapRowToModel(row);
    challenges.push(challenge);
  }

  return challenges;
}

export function getByKey(byKey: Challenge['key']) {
  const query =
    `SELECT * FROM ${TABLE.NAME} ` +
    `WHERE ${TABLE.COLUMN.KEY} = '${byKey}'`;

  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE.NAME} getChallengeByKey\n`, query);
  }

  const rows = runQuery(query);

  const firstResult = rows.next();
  const nextRow = rows.next();

  if (!nextRow.done) {
    console.warn('Multiple keys found');
  }

  const firstRow = firstResult.value;
  if (!firstRow) {
    return null;
  }

  const challenge = mapRowToModel(firstRow);
  return challenge;
}

type ChallengeInsert = Omit<Challenge, 'id'>;

export function insert(challenge: ChallengeInsert) {
  const query =
    `INSERT INTO ${TABLE.NAME} ` +
    `(` +
    `${TABLE.COLUMN.NAME}, ` +
    `${TABLE.COLUMN.KEY}` +
    `) VALUES (?,?)`;

  const values = [
    challenge.name,
    challenge.key,
  ];

  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE.NAME} insert\n`, query);
  }

  const rows = runQuery(query, values);
}
