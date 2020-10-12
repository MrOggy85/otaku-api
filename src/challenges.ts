import { getChallengeByKey, getChallenges } from "./db.ts";
import { Router } from "./deps.ts";

const ROUTE = "/challenges";

export function init(router: Router) {
  router
    .get(ROUTE, getAll)
    .get(`${ROUTE}/:key`, getByKey)
}

type Get = Router['get'];
type Middeware = Parameters<Get>[1];
type Context = Parameters<Middeware>[0];

function getAll(ctx: Context) {
  const challenges = getChallenges();

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
