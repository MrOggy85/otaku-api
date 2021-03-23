import { Database, SQLite3Connector } from "../deps.ts";
import {
  Challenge,
  Guess,
  Japanese,
  Sentence,
  Tag,
  TagChallenge,
  TagSentence,
  User,
} from "./models.ts";
import seedData from "./seedData.ts";

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
    Japanese,
    Sentence,
    Tag,
    Guess,
    User,
    Challenge,
  ]);

  await db.sync({ drop: false });

  await seedData();
}

export default initDb;
