import { createHttpError } from "../deps.ts";
import * as entity from "../db/repository/challenge.ts";
import { getAllSentencesByChallengeId } from "../db/repository/sentence.ts";
import { getAllByChallengeId } from "../db/repository/tag.ts";
import { Unwrap } from "../typeHelpers.ts";

type ChallengeModel = {
  id: number;
  name: string;
  tags: {
    id: number;
    name: string;
  }[];
};

type Entity = Unwrap<ReturnType<typeof entity["getAll"]>>[0];

async function getChallengeWithTags(
  challenge: Entity,
): Promise<ChallengeModel> {
  const tags = await getAllByChallengeId(challenge.id);

  const tagModels = tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
  }));

  return {
    id: challenge.id,
    name: challenge.name,
    tags: tagModels,
  };
}

export async function getAll() {
  const challenges = await entity.getAll();
  const promises = challenges.map((challenge) => {
    return getChallengeWithTags(challenge);
  });

  const challengeModels = await Promise.all(promises);

  return challengeModels;
}

export async function getById(id: number) {
  const challenge = await entity.getById(id);
  if (!challenge) {
    throw createHttpError(400, "No Challenge found");
  }
  const challengeModel = await getChallengeWithTags(challenge);

  return challengeModel;
}

export async function getSentences(id: number) {
  const sentences = await getAllSentencesByChallengeId(id);
  return sentences;
}

type Create = {
  name: string;
  tagIds: string[];
};

export async function create({ name, tagIds }: Create) {
  await entity.create({
    name,
    tagIds,
  });

  return true;
}

type Update = Create & {
  id: number;
  name: string;
  tagIds: string[];
};

export async function update({ id, name, tagIds }: Update) {
  await entity.update({
    id,
    name,
    tagIds,
  });

  return true;
}

export async function remove(id: number) {
  await entity.remove(id);

  return true;
}
