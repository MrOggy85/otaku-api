import {
  challenges,
  sentences as exampleSentences,
} from "../debug/exampleData.ts";
import {
  createTable as createChallengesTable,
  insert as insertChallenge,
} from "./challenges.ts";
import {
  createTables as createSentencesTables,
  getAll,
  insert as insertSentence,
} from "./sentences.ts";
import {
  createTables as createTagsTables,
} from './tags.ts';

export default function  init() {
  createChallengesTable();
  createSentencesTables();
  createTagsTables();

  challenges.forEach(x => {
    const challenge = getAll();
    if (challenge.length === 0) {
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
