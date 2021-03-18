import { Database, SQLite3Connector } from "../deps.ts";
import {
  Challenge,
  Guess,
  Japanese,
  Sentence,
  Tag,
  TagChallenge,
  TagSentence,
} from "./models.ts";

const DB_NAME = "./test.db";

async function initDb() {
  const connector = new SQLite3Connector({
    filepath: DB_NAME,
  });

  const db = new Database({
    connector,
    debug: false,
  });

  db.link([
    TagChallenge,
    TagSentence,
    Challenge,
    Tag,
    Sentence,
    Japanese,
    Guess,
  ]);

  await db.sync({ drop: false });
}

export default initDb;
