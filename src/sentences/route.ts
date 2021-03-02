import { createHttpError, Router, SqliteError } from "../deps.ts";
import { getIdParam } from "../routeValidation.ts";
import type { Context } from "../types.ts";
import * as handler from "./handler.ts";

const ROUTE = "/sentences";

async function getAll(ctx: Context) {
  const models = await handler.getAll();

  ctx.response.body = models;
}

async function getById(ctx: Context) {
  const id = getIdParam(ctx);

  try {
    const model = await handler.getById(id);
    ctx.response.body = model;
  } catch (error) {
    if (error instanceof SqliteError) {
      ctx.throw(400, error.message);
    }
    throw error;
  }
}

type InsertModel = {
  en?: string;
  ja?: string[];
  tagIds?: string[];
};

async function insert(ctx: Context) {
  const result = ctx.request.body({
    type: "json",
  });
  const { en, ja, tagIds }: InsertModel = await result.value;
  if (!en || !Array.isArray(ja) || !Array.isArray(tagIds)) {
    throw createHttpError(400, "wrong body");
  }

  try {
    await handler.create({
      en,
      ja,
      tagIds,
    });
  } catch (error) {
    if (error instanceof SqliteError) {
      ctx.throw(400, error.message);
    }
    throw error;
  }

  ctx.response.body = true;
}

type UpdateModel = InsertModel & {
  id?: string;
};

async function update(ctx: Context) {
  const result = ctx.request.body({
    type: "json",
  });
  const { id, en, ja, tagIds }: UpdateModel = await result.value;
  if (!id) {
    ctx.throw(400, '"id" is empty');
  }
  const idAsNumber = Number(id);
  if (!Number.isInteger(idAsNumber)) {
    ctx.throw(400, '"id" is not a number');
  }
  if (!en) {
    ctx.throw(400, '"name" is empty');
  }
  if (!Array.isArray(ja)) {
    ctx.throw(400, '"ja" is not an array');
  }
  if (!Array.isArray(tagIds)) {
    ctx.throw(400, '"tagIds" is not an array');
  }

  try {
    await handler.update({
      id: idAsNumber,
      en,
      ja,
      tagIds,
    });
  } catch (error) {
    if (error instanceof SqliteError) {
      ctx.throw(400, error.message);
    }
    throw error;
  }

  ctx.response.body = true;
}

async function remove(ctx: Context) {
  const id = ctx.params.id;
  if (!id) {
    ctx.throw(400, "no id provided");
  }
  const idAsNumber = Number(id);
  if (!Number.isInteger(idAsNumber)) {
    ctx.throw(400, '"id" is not a number');
  }

  try {
    await handler.remove(idAsNumber);
  } catch (error) {
    if (error instanceof SqliteError) {
      ctx.throw(400, error.message);
    }
    throw error;
  }

  ctx.response.body = true;
}

function init(router: Router) {
  router
    .get(ROUTE, getAll)
    .get(`${ROUTE}/:id`, getById)
    .post(`${ROUTE}`, insert)
    .put(`${ROUTE}`, update)
    .delete(`${ROUTE}/:id`, remove);
}

export default init;
