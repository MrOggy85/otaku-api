import { get } from "../debug/env.ts";
import { uuid } from "../deps.ts";
import { runQuery } from "./db.ts";

const TABLE_SENTENCES = {
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


// function mapRowToModel(row: any[]) {
//   const [id, name, key] = row;

//   const model: Sentence = {
//     id,
//     name,
//     key,
//   };

//   return model;
// }

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
    const [id, en, id_japanese, sentenceId, japanese] = row;
    if (!sentences[id]) {
      sentences[id] = {
        id,
        en,
        ja: [japanese],
      };
    } else {
      sentences[id].ja.push(japanese);
    }
  }

  return Object.values(sentences);
}

type SentenceInsert = Omit<Sentence, 'id'>;

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

  const querySentenceJapanese =
    `INSERT INTO ${TABLE_SENTENCE_JAPANESE.NAME} ` +
    `(` +
    `${TABLE_SENTENCE_JAPANESE.COLUMN.SENTENCE_ID}, ` +
    `${TABLE_SENTENCE_JAPANESE.COLUMN.JAPANESE}` +
    `) VALUES (?, ?)`;

  sentence.ja.forEach(x => {
    const querySentenceJapaneseValues = [
      id,
      x,
    ];

    if (get('DB_LOG_QUERY')) {
      console.log(`${TABLE_SENTENCE_JAPANESE.NAME} insert\n`, querySentenceJapanese, querySentenceJapaneseValues);
    }
    runQuery(querySentenceJapanese, querySentenceJapaneseValues);
  })




  return true;
}
