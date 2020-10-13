import type { Router } from "../deps.ts";
import type { Context } from "../types.ts";
import {
  getAll as getAllSentences,
  insert as insertSentence,
  update as updateSentence,
} from '../db/sentences.ts';

const ROUTE = "/sentences";

export function init(router: Router) {
  router
    .get(ROUTE, getAll)
    .post(`${ROUTE}`, insert)
    .put(`${ROUTE}`, update)
}

function getAll(ctx: Context) {
  const sentences = getAllSentences();

  ctx.response.body = sentences;
}

async function insert(ctx: Context) {
  let value = null;
  try {
    const result = ctx.request.body({
      type: 'json',
    });
    value = await result.value;
  } catch (error) {
    ctx.throw(400, 'wrong input');
  }

  const sentences = insertSentence({
    en: value.en,
    ja: value.ja,
  });

  ctx.response.body = sentences;
}

async function update(ctx: Context) {
  let value = null;
  try {
    const result = ctx.request.body({
      type: 'json',
    });
    value = await result.value;
  } catch (error) {
    ctx.throw(400, 'wrong input');
  }

  const sentences = updateSentence({
    id: value.id,
    en: value.en,
    ja: value.ja,
  });

  ctx.response.body = sentences;
}
