import {
  challenges,
  sentences as exampleSentences,
} from "../debug/exampleData.ts";
import {
  createTable as createChallengesTable,
  getByKey,
  insert as insertChallenge,
} from "./challenges.ts";
import {
  createTables as createSentencesTables,
  getAll,
  insert as insertSentence,
} from "./sentences.ts";

export default function  init() {
  createChallengesTable();
  createSentencesTables();

  challenges.forEach(x => {
    const challenge = getByKey(x.key);
    if (!challenge) {
      insertChallenge(x);
    }
  });

  const sentences = getAll();
  if (sentences.length === 0) {
    exampleSentences.forEach(x => {
      insertSentence(x);
    });
  }
}
