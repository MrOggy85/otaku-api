import { get } from "../debug/env.ts";
import { runQuery } from "./db.ts";
import { TABLE as TABLE_CHALLENGE } from './challenges.ts';
import { TABLE_SENTENCES } from "./sentences.ts";
import { uuid } from "../deps.ts";

const TABLE_TAGS = {
  NAME: 'tags',
  COLUMN: {
    ID: 'id',
    NAME: 'name',
  },
};

const TABLE_TAGS_CHALLENGES = {
  NAME: 'tags_challenges',
  COLUMN: {
    TAG_ID: 'tag_id',
    CHALLENGE_ID: 'challenge_id',
  },
};

const TABLE_TAGS_SENTENCES = {
  NAME: 'tags_sentences',
  COLUMN: {
    TAG_ID: 'tag_id',
    SENTENCES_ID: 'sentence_id',
  },
};

export type Tag = {
  id: string;
  name: string;
};

export function createTables() {
  createTags();
  createTagsChallenges();
  createTagsSentences();
}

function createTags() {
  const tableName = TABLE_TAGS.NAME;
  const id = TABLE_TAGS.COLUMN.ID;
  const name = TABLE_TAGS.COLUMN.NAME;

  const query =
    `CREATE TABLE IF NOT EXISTS ${tableName} ` +
    "(" +
    `${id} CHAR(36) PRIMARY KEY NOT NULL, ` +
    `${name} TEXT NOT NULL UNIQUE` +
  ")";

  if (get('DB_LOG_QUERY')) {
    console.log(`${tableName} create\n`, query);
  }
  runQuery(query);
}

function createTagsChallenges() {
  const tableName = TABLE_TAGS_CHALLENGES.NAME;
  const tagId = TABLE_TAGS_CHALLENGES.COLUMN.TAG_ID;
  const challengeId = TABLE_TAGS_CHALLENGES.COLUMN.CHALLENGE_ID;

  const query =
    `CREATE TABLE IF NOT EXISTS ${tableName} ` +
    "(" +
    `${tagId} CHAR(36) NOT NULL, ` +
    `${challengeId} CHAR(36) NOT NULL, ` +
    `FOREIGN KEY(${tagId}) ` +
    `REFERENCES ${TABLE_TAGS.NAME}(${TABLE_TAGS.COLUMN.ID}) ` +
    `FOREIGN KEY(${challengeId}) ` +
    `REFERENCES ${TABLE_CHALLENGE.NAME}(${TABLE_CHALLENGE.COLUMN.ID}) ` +
    `PRIMARY KEY(${tagId}, ${challengeId})` +
  ")";

  if (get('DB_LOG_QUERY')) {
    console.log(`${tableName} create\n`, query);
  }
  runQuery(query);
}

function createTagsSentences() {
  const tableName = TABLE_TAGS_SENTENCES.NAME;
  const tagId = TABLE_TAGS_SENTENCES.COLUMN.TAG_ID;
  const sentenceId = TABLE_TAGS_SENTENCES.COLUMN.SENTENCES_ID;

  const query =
    `CREATE TABLE IF NOT EXISTS ${tableName} ` +
    "(" +
    `${tagId} CHAR(36) NOT NULL, ` +
    `${sentenceId} CHAR(36) NOT NULL, ` +
    `FOREIGN KEY(${tagId}) ` +
    `REFERENCES ${TABLE_TAGS.NAME}(${TABLE_TAGS.COLUMN.ID})` +
    `FOREIGN KEY(${sentenceId}) ` +
    `REFERENCES ${TABLE_SENTENCES.NAME}(${TABLE_SENTENCES.COLUMN.ID})` +
    `PRIMARY KEY(${tagId}, ${sentenceId})` +
  ")";

  if (get('DB_LOG_QUERY')) {
    console.log(`${tableName} create\n`, query);
  }
  runQuery(query);
}

// deno-lint-ignore no-explicit-any
function mapRowToModel(row: any[]) {
  const [id, name] = row;

  const tag: Tag = {
    id,
    name,
  };

  return tag;
}

export function getAll() {
  const query =
    `SELECT * FROM ${TABLE_TAGS.NAME}`;

  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE_TAGS.NAME} getAll\n`, query);
  }
  const rows = runQuery(query);
  const tags: Tag[] = [];
  for (const row of rows) {
    const tag = mapRowToModel(row);
    tags.push(tag);
  }

  return tags;
}

export function getById(id: Tag['id']) {
  const query =
    `SELECT * FROM ${TABLE_TAGS.NAME} ` +
    `WHERE ${TABLE_TAGS.COLUMN.ID} = '${id}'`;

  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE_TAGS.NAME} getById\n`, query);
  }
  const rows = runQuery(query);
  const firstResult = rows.next();
  const firstRow = firstResult.value;
  if (!firstRow) {
    return null;
  }
  const model = mapRowToModel(firstRow);
  return model;
}

export function getByChallengeId(challengeId: string) {
  const tableTags = TABLE_TAGS.NAME;
  const tableTagChallenge = TABLE_TAGS_CHALLENGES.NAME;

  const query =
  `SELECT * FROM ${tableTags} ` +
  `JOIN ${tableTagChallenge} ON ` +
  `${tableTags}.${TABLE_TAGS.COLUMN.ID} = ` +
  `${tableTagChallenge}.${TABLE_TAGS_CHALLENGES.COLUMN.TAG_ID} ` +
  `WHERE ${TABLE_TAGS_CHALLENGES.COLUMN.CHALLENGE_ID} = '${challengeId}'`;

  if (get('DB_LOG_QUERY')) {
    console.log(`${tableTags} getByChallengeId\n`, query);
  }

  const rows = runQuery(query);
  const tags: Tag[] = [];
  for (const row of rows) {
    const tag = mapRowToModel(row);
    tags.push(tag);
  }

  return tags;
}

export function getBySentenceId(sentenceId: string) {
  const tableTags = TABLE_TAGS.NAME;
  const tableTagSentence = TABLE_TAGS_SENTENCES.NAME;

  const query =
  `SELECT * FROM ${tableTags} ` +
  `JOIN ${tableTagSentence} ON ` +
  `${tableTags}.${TABLE_TAGS.COLUMN.ID} = ` +
  `${tableTagSentence}.${TABLE_TAGS_SENTENCES.COLUMN.TAG_ID} ` +
  `WHERE ${TABLE_TAGS_SENTENCES.COLUMN.SENTENCES_ID} = '${sentenceId}'`;

  if (get('DB_LOG_QUERY')) {
    console.log(`${tableTags} getBySentenceId\n`, query);
  }

  const rows = runQuery(query);
  const tags: Tag[] = [];
  for (const row of rows) {
    const tag = mapRowToModel(row);
    tags.push(tag);
  }

  return tags;
}

type TagInsert = Pick<Tag, 'name'>;

export function insertTag(tag: TagInsert) {
  const id = uuid.generate();
  const query =
    `INSERT INTO ${TABLE_TAGS.NAME} ` +
    `(` +
    `${TABLE_TAGS.COLUMN.ID}, ` +
    `${TABLE_TAGS.COLUMN.NAME}` +
    `) VALUES (?,?)`;

  const values = [
    id,
    tag.name,
  ];

  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE_TAGS.NAME} insert\n`, query);
  }

  runQuery(query, values);

  return true
}

export function updateTag(tag: Tag) {
  const query =
    `UPDATE ${TABLE_TAGS.NAME} ` +
    `SET ${TABLE_TAGS.COLUMN.NAME} = '${tag.name}' ` +
    `WHERE ${TABLE_TAGS.COLUMN.ID} = '${tag.id}'`;

  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE_TAGS.NAME} update\n`, query);
  }

  runQuery(query);

  return true;
}

export function deleteTag(tagId: Tag['id']) {
  removeAllTagForeign(tagId);

  const query =
    `DELETE FROM ${TABLE_TAGS.NAME} ` +
    `WHERE ${TABLE_TAGS.COLUMN.ID} = '${tagId}'`;

  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE_TAGS.NAME} delete\n`, query);
  }

  runQuery(query);

  return true;
}

type TagChallenge = {
  challengeId: string;
  tagId: string;
}

export function insertTagChallenge(model: TagChallenge) {
  const query =
    `INSERT INTO ${TABLE_TAGS_CHALLENGES.NAME} ` +
    `(` +
    `${TABLE_TAGS_CHALLENGES.COLUMN.CHALLENGE_ID}, ` +
    `${TABLE_TAGS_CHALLENGES.COLUMN.TAG_ID}` +
    `) VALUES (?,?)`;

  const values = [
    model.challengeId,
    model.tagId,
  ];

  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE_TAGS_CHALLENGES.NAME} insert\n`, query);
  }

  runQuery(query, values);
}

type TagSentence = {
  sentenceId: string;
  tagId: string;
}

export function insertTagSentence(model: TagSentence) {
  const query =
    `INSERT INTO ${TABLE_TAGS_SENTENCES.NAME} ` +
    `(` +
    `${TABLE_TAGS_SENTENCES.COLUMN.SENTENCES_ID}, ` +
    `${TABLE_TAGS_SENTENCES.COLUMN.TAG_ID}` +
    `) VALUES (?,?)`;

  const values = [
    model.sentenceId,
    model.tagId,
  ];

  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE_TAGS_SENTENCES.NAME} insert\n`, query);
  }

  runQuery(query, values);
}

export function removeTagChallenge(tag: TagChallenge) {
  const query =
    `DELETE FROM ${TABLE_TAGS_CHALLENGES.NAME} ` +
    `WHERE ${TABLE_TAGS_CHALLENGES.COLUMN.CHALLENGE_ID} = '${tag.challengeId}' ` +
    `AND ${TABLE_TAGS_CHALLENGES.COLUMN.TAG_ID} = '${tag.tagId}'`;

  if (get('DB_LOG_QUERY')) {
    console.log(
      `${TABLE_TAGS_CHALLENGES.NAME} remove\n`, query);
  }

  runQuery(query);
}

export function removeTagSentence(tag: TagSentence) {
  const query =
    `DELETE FROM ${TABLE_TAGS_SENTENCES.NAME} ` +
    `WHERE ${TABLE_TAGS_SENTENCES.COLUMN.SENTENCES_ID} = '${tag.sentenceId}' ` +
    `AND ${TABLE_TAGS_SENTENCES.COLUMN.TAG_ID} = '${tag.tagId}'`;

  if (get('DB_LOG_QUERY')) {
    console.log(
      `${TABLE_TAGS_SENTENCES.NAME} remove\n`, query);
  }

  runQuery(query);
}

export function removeAllTagChallenge(challengeId: TagChallenge['challengeId']) {
  const query =
    `DELETE FROM ${TABLE_TAGS_CHALLENGES.NAME} ` +
    `WHERE ${TABLE_TAGS_CHALLENGES.COLUMN.CHALLENGE_ID} = '${challengeId}'`;

  if (get('DB_LOG_QUERY')) {
    console.log(
      `${TABLE_TAGS_CHALLENGES.NAME} remove all\n`, query);
  }

  runQuery(query);
}

export function removeAllTagSentence(sentenceId: TagSentence['sentenceId']) {
  const query =
    `DELETE FROM ${TABLE_TAGS_SENTENCES.NAME} ` +
    `WHERE ${TABLE_TAGS_SENTENCES.COLUMN.SENTENCES_ID} = '${sentenceId}'`;

  if (get('DB_LOG_QUERY')) {
    console.log(
      `${TABLE_TAGS_SENTENCES.NAME} remove all\n`, query);
  }

  runQuery(query);
}

export function removeAllTagForeign(id: Tag['id']) {
  let query =
    `DELETE FROM ${TABLE_TAGS_SENTENCES.NAME} ` +
    `WHERE ${TABLE_TAGS_SENTENCES.COLUMN.TAG_ID} = '${id}'`;

  if (get('DB_LOG_QUERY')) {
    console.log(
      `${TABLE_TAGS_SENTENCES.NAME} remove all\n`, query);
  }

  runQuery(query);

  query =
    `DELETE FROM ${TABLE_TAGS_CHALLENGES.NAME} ` +
    `WHERE ${TABLE_TAGS_CHALLENGES.COLUMN.TAG_ID} = '${id}'`;

  if (get('DB_LOG_QUERY')) {
    console.log(
      `${TABLE_TAGS_CHALLENGES.NAME} remove all\n`, query);
  }

  runQuery(query);
}
