import { get } from "../debug/env.ts";
import { uuid } from "../deps.ts";
import { runQuery } from "./db.ts";
import { getErrorCode, DbError } from "./dbError.ts";
import { getBySentenceId, insertTagSentence, removeAllTagSentence, Tag } from "./tags.ts";

export const TABLE_SENTENCES = {
  NAME: 'sentences',
  COLUMN: {
    ID: 'id',
    ENGLISH: 'english',
  },
}

const TABLE_SENTENCE_JAPANESE = {
  NAME: 'sentence_japanese',
  COLUMN: {
    ID: 'id',
    SENTENCE_ID: 'sentence_id',
    JAPANESE: 'japanese',
  },
}

type Sentence = {
  id: string;
  en: string;
  ja: string[];
  tags: Tag[];
}

export function createTables() {
  const qSentences =
    `CREATE TABLE IF NOT EXISTS ${TABLE_SENTENCES.NAME} ` +
    "(" +
    `${TABLE_SENTENCES.COLUMN.ID} CHAR(36) PRIMARY KEY NOT NULL, ` +
    `${TABLE_SENTENCES.COLUMN.ENGLISH} TEXT NOT NULL` +
    ")";

  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE_SENTENCES.NAME} create\n`, qSentences);
  }
  runQuery(qSentences);

  const qSentencesJapanese =
    `CREATE TABLE IF NOT EXISTS ${TABLE_SENTENCE_JAPANESE.NAME} ` +
    "(" +
    `${TABLE_SENTENCE_JAPANESE.COLUMN.ID} INTEGER PRIMARY KEY AUTOINCREMENT, ` +
    `${TABLE_SENTENCE_JAPANESE.COLUMN.SENTENCE_ID} CHAR(36) NOT NULL, ` +
    `${TABLE_SENTENCE_JAPANESE.COLUMN.JAPANESE} TEXT NOT NULL, ` +
    `FOREIGN KEY(${TABLE_SENTENCE_JAPANESE.COLUMN.SENTENCE_ID}) REFERENCES ${TABLE_SENTENCES.NAME}(${TABLE_SENTENCES.COLUMN.ID})` +
    ")"

  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE_SENTENCE_JAPANESE.NAME} create\n`, qSentencesJapanese);
  }
  runQuery(qSentencesJapanese);
}

// deno-lint-ignore no-explicit-any
function mapRowToModel(row: any[]) {
  const [id, en, japaneseId, sentenceId, japanese] = row;

  const sentence: Sentence = {
    id,
    en,
    ja: [japanese],
    tags: [],
  };

  return sentence;
}

export function getAll() {
  const query =
    `SELECT * FROM ${TABLE_SENTENCES.NAME} ` +
    `JOIN ${TABLE_SENTENCE_JAPANESE.NAME} ON ` +
    `${TABLE_SENTENCES.NAME}.${TABLE_SENTENCES.COLUMN.ID} = ` +
    `${TABLE_SENTENCE_JAPANESE.NAME}.${TABLE_SENTENCE_JAPANESE.COLUMN.SENTENCE_ID}`;

  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE_SENTENCES.NAME} getAll\n`, query);
  }
  const rows = runQuery(query);

  const sentences: Record<Sentence['id'], Sentence> = {};
  for (const row of rows) {
    const [id, en, japaneseId, sentenceId, japanese] = row;
    if (!sentences[id]) {
      sentences[id] = mapRowToModel(row)

      const tags = getBySentenceId(id);
      sentences[id].tags = tags;
    } else {
      sentences[id].ja.push(japanese);
    }
  }

  return Object.values(sentences);
}

export function getById(id: Sentence['id']) {
  const query =
    `SELECT * FROM ${TABLE_SENTENCES.NAME} ` +
    `JOIN ${TABLE_SENTENCE_JAPANESE.NAME} ON ` +
    `${TABLE_SENTENCES.NAME}.${TABLE_SENTENCES.COLUMN.ID} = ` +
    `${TABLE_SENTENCE_JAPANESE.NAME}.${TABLE_SENTENCE_JAPANESE.COLUMN.SENTENCE_ID} ` +
    `WHERE ${TABLE_SENTENCES.NAME}.${TABLE_SENTENCES.COLUMN.ID} = '${id}'`;

  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE_SENTENCES.NAME} getById\n`, query);
  }
  const rows = runQuery(query);
  const firstResult = rows.next();
  const firstRow = firstResult.value;
  if (!firstRow) {
    return null;
  }
  const sentence = mapRowToModel(firstRow);
  return sentence;
}

type SentenceInsert = Omit<Sentence, 'id' | 'tags'> & {
  tagIds: Sentence['tags'][0]['id'][];
}

function insertTags(tagIds: Sentence['tags'][0]['id'][], sentenceId: Sentence['id']) {
  tagIds.forEach(tagId => {
    try {
      insertTagSentence({
        sentenceId,
        tagId,
      })
    } catch (error) {
      switch (getErrorCode(error)) {
        case 'FOREIGN KEY':
          throw new DbError(`tagId ${tagId} does not exist`, 'FOREIGN KEY', 'tags')

        default:
          throw error;
      }
    }
  })
}

function insertJapaneseSentences(ja: Sentence['ja'], id: Sentence['id']) {
  const querySentenceJapanese =
    `INSERT INTO ${TABLE_SENTENCE_JAPANESE.NAME} ` +
    `(` +
    `${TABLE_SENTENCE_JAPANESE.COLUMN.SENTENCE_ID}, ` +
    `${TABLE_SENTENCE_JAPANESE.COLUMN.JAPANESE}` +
    `) VALUES (?, ?)`;

  ja.forEach(j => {
    const querySentenceJapaneseValues = [
      id,
      j,
    ];

    if (get('DB_LOG_QUERY')) {
      console.log(`${TABLE_SENTENCE_JAPANESE.NAME} insert\n`, querySentenceJapanese, querySentenceJapaneseValues);
    }
    runQuery(querySentenceJapanese, querySentenceJapaneseValues);
  })
}

export function insert(sentence: SentenceInsert) {
  const id = uuid.generate();
  const querySentence =
    `INSERT INTO ${TABLE_SENTENCES.NAME} ` +
    `(` +
    `${TABLE_SENTENCES.COLUMN.ID}, ` +
    `${TABLE_SENTENCES.COLUMN.ENGLISH}` +
    `) VALUES (?, ?)`;
  const querySentenceValues = [
    id,
    sentence.en,
  ]

  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE_SENTENCES.NAME} insert\n`, querySentence, querySentenceValues);
  }
  runQuery(querySentence, querySentenceValues);

  insertJapaneseSentences(sentence.ja, id);

  insertTags(sentence.tagIds, id);

  return true;
}

type SentenceUpdate = Omit<Sentence, 'tags'> & {
  tagIds: Sentence['tags'][0]['id'][];
}

function deleteAllJapaneseSentencesById(id: Sentence['id']) {
  const querySentenceJapaneseDelete =
    `DELETE FROM ${TABLE_SENTENCE_JAPANESE.NAME} ` +
    `WHERE ${TABLE_SENTENCE_JAPANESE.COLUMN.SENTENCE_ID} = '${id}'`;

  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE_SENTENCE_JAPANESE.NAME} delete\n`, querySentenceJapaneseDelete);
  }
  runQuery(querySentenceJapaneseDelete);
}

export function update(sentence: SentenceUpdate) {
  const querySentence =
    `UPDATE ${TABLE_SENTENCES.NAME} ` +
    `SET ${TABLE_SENTENCES.COLUMN.ENGLISH} = '${sentence.en}'` +
    `WHERE ${TABLE_SENTENCES.COLUMN.ID} = '${sentence.id}'`;

  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE_SENTENCES.NAME} update\n`, querySentence);
  }
  runQuery(querySentence);

  deleteAllJapaneseSentencesById(sentence.id);
  insertJapaneseSentences(sentence.ja, sentence.id);

  removeAllTagSentence(sentence.id)
  insertTags(sentence.tagIds, sentence.id);

  return true;
}

export function remove(sentenceId: Sentence['id']) {
  deleteAllJapaneseSentencesById(sentenceId);

  const query =
    `DELETE FROM ${TABLE_SENTENCES.NAME} ` +
    `WHERE ${TABLE_SENTENCES.COLUMN.ID} = '${sentenceId}'`;

  if (get('DB_LOG_QUERY')) {
    console.log(`${TABLE_SENTENCES.NAME} remove\n`, query);
  }

  runQuery(query);
}
