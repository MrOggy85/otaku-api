import { Model } from "../../deps.ts";
import { Tag, TagChallenge, TagSentence } from "../models.ts";

type TagModel = {
  id: number;
  name: string;
} & Model;

export async function getAll() {
  const entity = await Tag.all();
  return entity as unknown as TagModel[];
}

export async function getById(id: number) {
  const challenge = await Tag.where("id", id).first();
  return challenge as unknown as TagModel | undefined;
}

export async function getAllByChallengeId(challengeId: number) {
  const entity = await Tag
    .select(Tag.field("id"), "name")
    .where(TagChallenge.field("challenge_id"), challengeId)
    .join(TagChallenge, TagChallenge.field("tag_id"), Tag.field("id"))
    .all();

  return entity as unknown as TagModel[];
}

export async function getAllBySentenceId(sentenceId: number) {
  const entity = await Tag
    .select(Tag.field("id"), "name")
    .where(TagSentence.field("sentence_id"), sentenceId)
    .join(TagSentence, TagSentence.field("tag_id"), Tag.field("id"))
    .all();

  return entity as unknown as TagModel[];
}

type Create = {
  name: TagModel["name"];
};

export async function create({ name }: Create) {
  await Tag.create({
    name,
  });
}

type Update = Create & {
  id: TagModel["id"];
};

export async function update({ id, name }: Update) {
  await Tag.where("id", id).update({
    name,
  });
}

export async function remove(id: TagModel["id"]) {
  await Tag.deleteById(id);
}
