import { get } from "../debug/env.ts";
import { uuid } from "../deps.ts";
import { runQuery } from "./db.ts";
import { DbError, getErrorCode } from "./dbError.ts";
import {
  getByChallengeId,
  insertTagChallenge,
  removeAllTagChallenge,
  Tag,
} from "./tags.ts";

export const TABLE = {
  NAME: 'challenges',
  COLUMN: {
    ID: 'id',
    NAME: 'name',
  },
}

type Challenge = {
  id: string;
  name: string;
  tags: Tag[];
}

export function createTable() {
  const query =
    `CREATE TABLE IF NOT EXISTS ${TABLE.NAME} ` +
    "(" +
    `${TABLE.COLUMN.ID} CHAR(36) PRIMARY KEY NOT NULL, ` +
    `${TABLE.COLUMN.NAME} TEXT NOT NULL UNIQUE` +
    // `${TABLE.COLUMN.KEY} TEXT NOT NULL` +
    ")";

    if (get('DB_LOG_QUERY')) {
      console.log(`${TABLE.NAME} create\n`, query);
    }
    runQuery(query);
}

// deno-lint-ignore no-explicit-any
function mapRowToModel(row: any[]) {
  const [id, name] = row;

  const challenge: Challenge = {
    id,
    name,
    tags: [],
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
    const tags = getByChallengeId(challenge.id);
    challenge.tags = tags;

    challenges.push(challenge);
  }

  return challenges;
}

export function getById(id: Challenge['id']) {
  const query =
    `SELECT * FROM ${TABLE.NAME} ` +
    `WHERE ${TABLE.COLUMN.ID} = '${id}'`;

  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE.NAME} getById\n`, query);
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
  const tags = getByChallengeId(challenge.id);
  challenge.tags = tags;

  return challenge;
}

type ChallengeInsert = Omit<Challenge, 'id' | 'tags'> & {
  tagIds: string[];
};

export function insert(challenge: ChallengeInsert) {
  const id = uuid.generate();
  const query =
    `INSERT INTO ${TABLE.NAME} ` +
    `(` +
    `${TABLE.COLUMN.ID}, ` +
    `${TABLE.COLUMN.NAME}` +
    `) VALUES (?,?)`;

  const values = [
    id,
    challenge.name,
  ];

  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE.NAME} insert\n`, query);
  }

  runQuery(query, values);

  challenge.tagIds.forEach(tagId => {
    insertTagChallenge({
      challengeId: id,
      tagId,
    })
  })
}

type ChallengeUpdate = Omit<Challenge, 'tags'> & {
  tagIds: string[];
};

export function update(challenge: ChallengeUpdate) {
  const query =
    `UPDATE ${TABLE.NAME} ` +
    `SET ${TABLE.COLUMN.NAME} = '${challenge.name}'` +
    `WHERE ${TABLE.COLUMN.ID} = '${challenge.id}'`;

  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE.NAME} update\n`, query);
  }

  runQuery(query);

  removeAllTagChallenge(challenge.id);

  challenge.tagIds.forEach(tagId => {
    try {
      insertTagChallenge({
        challengeId: challenge.id,
        tagId,
      })
    } catch (error) {
      switch (getErrorCode(error)) {
        case 'FOREIGN_KEY':
          throw new DbError(`tagId ${tagId} does not exist`, 'FOREIGN_KEY', 'tags')

        default:
          throw error
      }
    }
  })
}

export function remove(challengeId: Challenge['id']) {
  const query =
    `DELETE FROM ${TABLE.NAME} ` +
    `WHERE ${TABLE.COLUMN.ID} = '${challengeId}'`;

  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE.NAME} remove\n`, query);
  }

  removeAllTagChallenge(challengeId);

  runQuery(query);
}
