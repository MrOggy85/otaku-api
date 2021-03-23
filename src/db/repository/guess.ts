import { Model } from "../../deps.ts";
import { Guess } from "../models.ts";

type GuessModel = {
  id: number;
  sentenceId: number;
  challengeId: number;
  correct: boolean;
} & Model;

export async function getAll() {
  const entity = await Guess.all();
  return entity as unknown as GuessModel[];
}

export async function getById(id: number) {
  const entity = await Guess.where("id", id).first();
  return entity as unknown as GuessModel | undefined;
}
type Create = {
  sentenceId: GuessModel["sentenceId"];
  challengeId: GuessModel["challengeId"];
  correct: GuessModel["correct"];
};

export async function create({ sentenceId, challengeId, correct }: Create) {
  await Guess.create({
    sentenceId,
    challengeId,
    correct,
  });
}

type Update = Create & {
  id: GuessModel["id"];
};

export async function update({ id, sentenceId, challengeId, correct }: Update) {
  await Guess.where("id", id).update({
    sentenceId,
    challengeId,
    correct,
  });
}

export async function remove(id: GuessModel["id"]) {
  await Guess.deleteById(id);
}
