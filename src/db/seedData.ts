import { create as createTag } from "../tags/handler.ts";
import { create as createSentence } from "../sentences/handler.ts";
import { create as createChallenge } from "../challenges/handler.ts";
import { create as createGuess } from "../guess/handler.ts";

async function seedData() {
  await createTag({
    name: "Tag1",
  });
  await createTag({
    name: "Tag2",
  });

  await createSentence({
    en: "An example sentence",
    ja: ["例えば例文"],
    tagIds: ["1"],
  });
  await createSentence({
    en: "Another sentence",
    ja: ["例文もう一つ"],
    tagIds: ["1", "2"],
  });

  await createChallenge({
    name: "Super Challenge",
    tagIds: ["2"],
  });

  await createGuess({
    sentenceId: 1,
    challengeId: 1,
    correct: true,
  });
  await createGuess({
    sentenceId: 2,
    challengeId: 1,
    correct: false,
  });
}

export default seedData;
