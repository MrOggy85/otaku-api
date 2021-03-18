import AppError from "../AppError.ts";
import * as entity from "../db/repository/sentence.ts";
import { getAllBySentenceId } from "../db/repository/tag.ts";
import { Unwrap } from "../typeHelpers.ts";

type SentenceModel = {
  id: number;
  en: string;
  ja: string[];
  tags: {
    id: number;
    name: string;
  }[];
};

type Entity = Unwrap<ReturnType<typeof entity["getAll"]>>[0];

async function getSentenceWithTags(sentence: Entity): Promise<SentenceModel> {
  const tags = await getAllBySentenceId(sentence.id);

  const tagModels = tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
  }));

  return {
    id: sentence.id,
    en: sentence.en,
    ja: sentence.ja,
    tags: tagModels,
  };
}

export async function getAll() {
  const entities = await entity.getAll();
  const promises = entities.map((entity) => {
    return getSentenceWithTags(entity);
  });

  const models = await Promise.all(promises);

  return models;
}

export async function getById(id: number) {
  const sentenceModel = await entity.getById(id);
  if (!sentenceModel) {
    throw new AppError("No Sentence found", 400);
  }
  const sentenceModelWithTags = await getSentenceWithTags(sentenceModel);

  return sentenceModelWithTags;
}

type Create = {
  en: string;
  ja: string[];
  tagIds: string[];
};

export async function create({ en, ja, tagIds }: Create) {
  await entity.create({
    en,
    ja,
    tagIds,
  });

  return true;
}

type Update = Create & {
  id: number;
};

export async function update({ id, en, ja, tagIds }: Update) {
  await entity.update({
    id,
    en,
    ja,
    tagIds,
  });

  return true;
}

export async function remove(id: number) {
  await entity.remove(id);

  return true;
}
