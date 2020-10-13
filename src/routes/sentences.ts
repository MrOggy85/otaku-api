import type { Router } from "../deps.ts";
import type { Context } from "../types.ts";
import {
  getAll as getAllSentences,
} from '../db/sentences.ts';

const ROUTE = "/sentences";

export function init(router: Router) {
  router
    .get(ROUTE, getAll)
    // .get(`${ROUTE}/:key`, getByKey)
}

function getAll(ctx: Context) {
  const sentences = getAllSentences();

  ctx.response.body = sentences;
}
