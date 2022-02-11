import { Model } from "../../deps.ts";
import {
  Japanese,
  Sentence,
  TagChallenge,
  TagSentence,
} from "../models.ts";
import { getAllBySentenceId } from "./japanese.ts";

type SentenceEntity = {
  id: number;
  en: string;
};

type SentenceModel = SentenceEntity & {
  ja: string[];
  tagIds: string[];
} & Model;

async function getSentenceWithJapanese(sentence: SentenceEntity) {
  const ja = await getAllBySentenceId(sentence.id);

  return {
    id: sentence.id,
    en: sentence.en,
    ja: ja,
  };
}

export async function getAll() {
  const entities = await Sentence.all() as unknown as SentenceEntity[];
  const promises = entities.map((entity) => {
    return getSentenceWithJapanese(entity);
  });

  const sentenceModels = await Promise.all(promises);

  return sentenceModels as unknown as SentenceModel[];
}

export async function getById(id: number) {
  const entity = await Sentence.where("id", id).first();
  return entity as unknown as SentenceModel | undefined;
}

export async function getAllSentencesByChallengeId(id: number) {
  const entities = await Sentence
    .select(Sentence.field("id"), Sentence.field("en"))
    .join(TagSentence, TagSentence.field("sentence_id"), Sentence.field("id"))
    .join(
      TagChallenge,
      TagChallenge.field("tag_id"),
      TagSentence.field("tag_id"),
    )
    .where(TagChallenge.field("challenge_id"), id)
    .groupBy(Sentence.field("id"))
    .get() as unknown as SentenceModel[];

  const promises = entities.map((entity) => {
    return getSentenceWithJapanese(entity);
  });

  const sentenceModels = await Promise.all(promises);

  return sentenceModels as unknown as SentenceModel[];
}

async function createTagSentence(
  tagIds: string[],
  sentenceId: SentenceModel["id"],
) {
  const promises = tagIds.map((tagId) => {
    return TagSentence.create({
      tagId: Number(tagId),
      sentenceId,
    });
  });
  await Promise.all(promises);
}

async function createJapanese(ja: string[], sentenceId: SentenceModel["id"]) {
  const promises = ja.map((jaSentence) => {
    return Japanese.create({
      name: jaSentence,
      sentenceId,
    });
  });
  await Promise.all(promises);
}

type Create = {
  en: SentenceModel["en"];
  ja: SentenceModel["ja"];
  tagIds: SentenceModel["tagIds"];
};

export async function create({ en, ja, tagIds }: Create) {
  const { lastInsertId } = await Sentence.create({
    en,
  }) as Model & { lastInsertId: number };
  await createTagSentence(tagIds,lastInsertId);
  await createJapanese(ja, lastInsertId);
}

type Update = Create & {
  id: SentenceModel["id"];
};

export async function update({ id, en, ja, tagIds }: Update) {
  await Sentence.where("id", id).update({
    en,
  }) as SentenceModel;

  await TagSentence.where("sentence_id", id).delete();
  await createTagSentence(tagIds, id);

  await Japanese.where("sentence_id", id).delete();
  await createJapanese(ja, id);
}

export async function remove(id: SentenceModel["id"]) {
  await Sentence.deleteById(id);
}
