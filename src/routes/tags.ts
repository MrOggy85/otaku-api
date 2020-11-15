import type { Router } from "../deps.ts";
import type { Context } from "../types.ts";
import {
  getAll as getAllTags,
  getById as getTagById,
  insertTag,
  updateTag,
  deleteTag,
} from '../db/tags.ts';

const ROUTE = "/tags";

type TagInsert = Parameters<typeof insertTag>[0]
type TagUpdate = Parameters<typeof updateTag>[0]

export function init(router: Router) {
  router
    .get(ROUTE, getAll)
    .get(`${ROUTE}/:id`, getById)
    .post(`${ROUTE}`, insert)
    .put(`${ROUTE}`, update)
    .delete(`${ROUTE}/:id`, remove)
}

function getAll(ctx: Context) {
  const tags = getAllTags();

  ctx.response.body = tags;
}

function getById(ctx: Context) {
  const idParam = ctx.params.id;
  if (!idParam) {
    ctx.throw(400, 'no id provided');
  }

  const tag = getTagById(idParam);
  if (!tag) {
    ctx.throw(404, `No Tag with key ${idParam}`);
  }

  ctx.response.body = tag;
}

async function insert(ctx: Context) {
  const result = ctx.request.body({
    type: 'json',
  });
  const { name }: TagInsert = await result.value;
  if (!name) {
    ctx.throw(400, '"name" is empty');
  }

  const success = insertTag({
    name,
  });

  ctx.response.body = success;
}

async function update(ctx: Context) {
  const result = ctx.request.body({
    type: 'json',
  });
  const { id, name }: TagUpdate = await result.value;
  if (!id) {
    ctx.throw(400, '"id" is empty');
  }
  if (!name) {
    ctx.throw(400, '"name" is empty');
  }

  const success = updateTag({
    id,
    name,
  });

  ctx.response.body = success;
}

async function remove(ctx: Context) {
  const idParam = ctx.params.id;
  if (!idParam) {
    ctx.throw(400, 'no id provided');
  }

  const success = deleteTag(idParam);

  ctx.response.body = success;
}
