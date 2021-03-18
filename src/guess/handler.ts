import AppError from "../AppError.ts";
import * as entity from "../db/repository/guess.ts";

export async function getAll() {
  const models = await entity.getAll();
  return models;
}

export async function getById(id: number) {
  const model = await entity.getById(id);
  if (!model) {
    throw new AppError("No Guess found", 400);
  }
  return model;
}

type Create = Parameters<typeof entity.create>[0]

export async function create({ sentenceId, challengeId, correct }: Create) {
  await entity.create({
    sentenceId,
    challengeId,
    correct,
  });

  return true;
}

type Update = Create & {
  id: number;
};

export async function update({ id, sentenceId, challengeId, correct }: Update) {
  await entity.update({
    id,
    sentenceId,
    challengeId,
    correct,
  });

  return true;
}

export async function remove(id: number) {
  await entity.remove(id);

  return true;
}
