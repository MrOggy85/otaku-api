import AppError from "../AppError.ts";
import { Router } from "../deps.ts";
import { getIdParam } from "../routeValidation.ts";
import type { Context } from "../types.ts";
import * as handler from "./handler.ts";

const ROUTE = "/challenges";

async function getAll(ctx: Context) {
  const models = await handler.getAll();

  ctx.response.body = models;
}

async function getById(ctx: Context) {
  const id = getIdParam(ctx);

  const model = await handler.getById(id);
  ctx.response.body = model;
}

async function getSentences(ctx: Context) {
  const id = getIdParam(ctx);

  const models = await handler.getSentences(id);
  ctx.response.body = models;
}

type InsertModel = {
  name?: string;
  tagIds?: string[];
};

async function insert(ctx: Context) {
  const result = ctx.request.body({
    type: "json",
  });
  const { name, tagIds }: InsertModel = await result.value as InsertModel;
  if (!name || !Array.isArray(tagIds)) {
    throw new AppError("wrong body", 400);
  }

  await handler.create({
    name,
    tagIds,
  });

  ctx.response.body = true;
}

type UpdateModel = InsertModel & {
  id?: string;
};

async function update(ctx: Context) {
  const result = ctx.request.body({
    type: "json",
  });
  const { id, name, tagIds }: UpdateModel = await result.value;
  if (!id) {
    ctx.throw(400, '"id" is empty');
  }
  const idAsNumber = Number(id);
  if (!Number.isInteger(idAsNumber)) {
    ctx.throw(400, '"id" is not a number');
  }
  if (!name) {
    ctx.throw(400, '"name" is empty');
  }
  if (!Array.isArray(tagIds)) {
    ctx.throw(400, '"tagIds" is not an array');
  }

  handler.update({
    id: idAsNumber,
    name,
    tagIds,
  });

  ctx.response.body = true;
}

async function remove(ctx: Context) {
  const id = getIdParam(ctx);

  await handler.remove(id);

  ctx.response.body = true;
}

function init(router: Router) {
  router
    .get(ROUTE, getAll)
    .get(`${ROUTE}/:id`, getById)
    .get(`${ROUTE}/:id/sentences`, getSentences)
    .post(`${ROUTE}`, insert)
    .put(`${ROUTE}`, update)
    .delete(`${ROUTE}/:id`, remove);
}

export default init;
