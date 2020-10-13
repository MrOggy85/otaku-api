import type { Router } from "../deps.ts";
import type { Context } from "../types.ts";
import {
  getAll as getAllChallenges,
  getByKey as getChallengeByKey,
} from '../db/challenges.ts';

const ROUTE = "/challenges";

export function init(router: Router) {
  router
    .get(ROUTE, getAll)
    .get(`${ROUTE}/:key`, getByKey)
}

function getAll(ctx: Context) {
  const challenges = getAllChallenges();

  ctx.response.body = challenges;
}

function getByKey(ctx: Context) {
  const key = ctx.params.key;
  console.log('challenges key', key, typeof key);
  if (!key) {
    ctx.throw(400);
  }

  const challenge = getChallengeByKey(key);
  if (!challenge) {
    ctx.throw(400, `No Challenge with key ${key}`);
  }

  ctx.response.body = challenge;
}
