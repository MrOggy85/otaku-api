import { Japanese } from "../models.ts";

type JapaneseModel = {
  id: number;
  name: string;
};

export async function getAllBySentenceId(sentenceId: number) {
  const entity = await Japanese
    .select(Japanese.field("id"), "name")
    .where(Japanese.field("sentence_id"), sentenceId)
    .all();

  return entity as unknown as JapaneseModel[];
}
