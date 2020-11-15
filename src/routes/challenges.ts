import type { Router } from "../deps.ts";
import type { Context } from "../types.ts";
import {
  getAll as getAllChallenges,
  getById as getChallengeById,
  insert as insertChallenge,
  update as updateChallenge,
  remove as removeChallenge,
} from '../db/challenges.ts';
import { DbError } from "../db/dbError.ts";

const ROUTE = "/challenges";

type ChallengeInsert = Parameters<typeof insertChallenge>[0]
type ChallengeUpdate = Parameters<typeof updateChallenge>[0]

export function init(router: Router) {
  router
    .get(ROUTE, getAll)
    .get(`${ROUTE}/:id`, getById)
    .post(`${ROUTE}`, insert)
    .put(`${ROUTE}`, update)
    .delete(`${ROUTE}/:id`, remove)
}

function getAll(ctx: Context) {
  const challenges = getAllChallenges();

  ctx.response.body = challenges;
}

function getById(ctx: Context) {
  const idParam = ctx.params.id;
  if (!idParam) {
    ctx.throw(400, 'no id provided');
  }

  const challenge = getChallengeById(idParam);
  if (!challenge) {
    ctx.throw(400, `No Challenge with key ${idParam}`);
  }

  ctx.response.body = challenge;
}

async function insert(ctx: Context) {
  let value = null;
  try {
    const result = ctx.request.body({
      type: 'json',
    });
    value = await result.value;
    if (!value.name || !value.tagIds) {
      throw new Error('invalid input');
    }
  } catch (error) {
    ctx.throw(400, 'wrong input');
  }

  try {
    insertChallenge({
      name: value.name,
      tagIds: value.tagIds,
    });
  } catch (error) {
    if (error.message === 'UNIQUE constraint failed: challenges.name') {
      ctx.throw(400, 'Name taken');
    }
    ctx.throw(500, error.message);
  }


  ctx.response.body = true;
}

async function update(ctx: Context) {
  const result = ctx.request.body({
    type: 'json',
  });
  const { id, name, tagIds }: ChallengeUpdate = await result.value;
  if (!id) {
    ctx.throw(400, '"id" is empty');
  }
  if (!name) {
    ctx.throw(400, '"name" is empty');
  }
  if (!Array.isArray(tagIds)) {
    ctx.throw(400, '"tagIds" is not an array');
  }

  try {
    updateChallenge({
      id,
      name,
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

  removeChallenge(idParam);

  ctx.response.body = true;
}
