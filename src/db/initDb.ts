import { Database, PostgresConnector } from "../deps.ts";
import getEnv from "../getEnv.ts";
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

const DB_USER = getEnv("DB_USER");
const DB_PASSWORD = getEnv("DB_PASSWORD");
const DB_NAME = getEnv("DB_NAME");
const DB_HOST = getEnv("DB_HOST");
const DB_PORT = Number(getEnv("DB_PORT"));

async function initDb() {
  const connector = new PostgresConnector({
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
  });

  const db = new Database({
    connector,
    debug: false,
  });

  db.link([
    Tag,
    Challenge,
    Sentence,
    Japanese,
    TagChallenge,
    TagSentence,
    Guess,
    User,
  ]);

  await db.sync({ drop: true, truncate: false });

  await seedData();
}

export default initDb;
