import type { Router } from "../deps.ts";
import type { Context } from "../types.ts";
import {
  getAll as getAllSentences,
  getById as getSentencesById,
  insert as insertSentence,
  update as updateSentence,
  remove as removeSentence,
} from '../db/sentences.ts';
import { DbError } from '../db/dbError.ts'

const ROUTE = "/sentences";

type InsertSentence = Parameters<typeof insertSentence>[0]
type UpdateSentence = Parameters<typeof updateSentence>[0]

export function init(router: Router) {
  router
    .get(ROUTE, getAll)
    .get(`${ROUTE}/:id`, getById)
    .post(`${ROUTE}`, insert)
    .put(`${ROUTE}`, update)
    .delete(`${ROUTE}/:id`, remove)
}

function getAll(ctx: Context) {
  const sentences = getAllSentences();

  ctx.response.body = sentences;
}

function getById(ctx: Context) {
  const idParam = ctx.params.id;
  if (!idParam) {
    ctx.throw(400, 'no id provided');
  }

  let sentence
  try {
    sentence = getSentencesById(idParam);
  } catch (error) {
    ctx.throw(500, error.message)
  }

  if (!sentence) {
    ctx.throw(400, `No Sentence with key ${idParam}`);
  }

  ctx.response.body = sentence;
}

async function insert(ctx: Context) {
  const result = ctx.request.body({
    type: 'json',
  });
  const { en, ja, tagIds }: InsertSentence = await result.value;
  if (!en) {
    ctx.throw(400, '"en" is empty');
  }
  if (!Array.isArray(ja)) {
    ctx.throw(400, '"ja" is not an array');
  }
  if (!Array.isArray(tagIds)) {
    ctx.throw(400, '"tagIds" is not an array');
  }

  try {
    insertSentence({
      en,
      ja,
      tagIds,
    });
  } catch (error) {
    if (error instanceof DbError) {
      ctx.throw(400, error.message);
    } else {
      throw error;
    }
  }

  ctx.response.body = true;
}

async function update(ctx: Context) {
  const result = ctx.request.body({
    type: 'json',
  });
  const { id, en, ja, tagIds }: UpdateSentence = await result.value;
  if (!id) {
    ctx.throw(400, '"id" is empty');
  }
  if (!en) {
    ctx.throw(400, '"en" is empty');
  }
  if (!Array.isArray(ja)) {
    ctx.throw(400, '"ja" is not an array');
  }
  if (!Array.isArray(tagIds)) {
    ctx.throw(400, '"tagIds" is not an array');
  }

  try {
    updateSentence({
      id,
      en,
      ja,
      tagIds,
    });
  } catch (error) {
    if (error instanceof DbError) {
      ctx.throw(400, error.message);
    } else {
      throw error;
    }
  }

  ctx.response.body = true;
}

async function remove(ctx: Context) {
  const idParam = ctx.params.id;
  if (!idParam) {
    ctx.throw(400, 'no id provided');
  }

  removeSentence(idParam);

  ctx.response.body = true;
}
