import { Model } from "../../deps.ts";
import { Challenge, TagChallenge } from "../models.ts";

type ChallengeModel = {
  id: number;
  name: string;
} & Model;

export async function getAll() {
  const challenges = await Challenge.all();
  return challenges as unknown as ChallengeModel[];
}

export async function getById(id: number) {
  const challenge = await Challenge.where("id", id).first();
  return challenge as unknown as ChallengeModel | undefined;
}

async function createTagChallenge(
  tagIds: string[],
  challengeId: ChallengeModel["id"],
) {
  const promises = tagIds.map((tagId) => {
    return TagChallenge.create({
      tagId: Number(tagId),
      challengeId,
    });
  });
  await Promise.all(promises);
}

type Create = {
  name: ChallengeModel["name"];
  tagIds: string[];
};

export async function create({ name, tagIds }: Create) {
  const { lastInsertId } = await Challenge.create({
    name,
  }) as Model & { lastInsertId: number };

  await createTagChallenge(tagIds, lastInsertId);
}

type Update = Create & {
  id: ChallengeModel["id"];
};

export async function update({ id, name, tagIds }: Update) {
  const challenge = await Challenge.where("id", id).update({
    name,
  }) as ChallengeModel;

  await TagChallenge.where("challenge_id", id).delete();

  await createTagChallenge(tagIds, challenge.id);
}

export async function remove(id: ChallengeModel["id"]) {
  await Challenge.deleteById(id);
}
