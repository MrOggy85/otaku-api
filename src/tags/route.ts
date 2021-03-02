import { createHttpError, Router, SqliteError } from "../deps.ts";
import { getIdParam } from "../routeValidation.ts";
import type { Context } from "../types.ts";
import * as handler from "./handler.ts";

const ROUTE = "/tags";

async function getAll(ctx: Context) {
  const models = await handler.getAll();

  ctx.response.body = models;
}

async function getById(ctx: Context) {
  const id = getIdParam(ctx);

  try {
    const model = await handler.getById(Number(id));
    ctx.response.body = model;
  } catch (error) {
    if (error instanceof SqliteError) {
      ctx.throw(400, error.message);
    }
    throw error;
  }
}

type InsertModel = {
  name?: string;
};

async function insert(ctx: Context) {
  const result = ctx.request.body({
    type: "json",
  });
  const { name }: InsertModel = await result.value as InsertModel;
  if (!name) {
    throw createHttpError(400, "wrong body");
  }

  try {
    await handler.create({
      name,
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
  const { id, name }: UpdateModel = await result.value;
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

  try {
    handler.update({
      id: idAsNumber,
      name,
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
  const id = getIdParam(ctx);

  try {
    await handler.remove(id);
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
