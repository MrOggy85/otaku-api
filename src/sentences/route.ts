import AppError from "../AppError.ts";
import { Context, PostgresError, Router, RouterContext } from "../deps.ts";
import { getIdParamAsNumber } from "../routeValidation.ts";
import * as handler from "./handler.ts";

const ROUTE = "/sentences";

async function getAll(ctx: Context) {
  const models = await handler.getAll();

  ctx.response.body = models;
}

type GetByIdContext = RouterContext<"/sentences/:id", { id: string }>;
async function getById(ctx: GetByIdContext) {
  const id = getIdParamAsNumber(ctx.params.id);

  try {
    const model = await handler.getById(id);
    ctx.response.body = model;
  } catch (error) {
    if (error instanceof PostgresError) {
      throw new AppError(error.message, 400);
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
    throw new AppError("wrong body", 400);
  }

  await handler.create({
    en,
    ja,
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
  const { id, en, ja, tagIds }: UpdateModel = await result.value;

  const idAsNumber = getIdParamAsNumber(id);

  if (!en) {
    throw new AppError('"name" is empty', 400);
  }
  if (!Array.isArray(ja)) {
    throw new AppError('"ja" is not an array', 400);
  }
  if (!Array.isArray(tagIds)) {
    throw new AppError('"tagIds" is not an array', 400);
  }

  await handler.update({
    id: idAsNumber,
    en,
    ja,
    tagIds,
  });

  ctx.response.body = true;
}

type RemoveContext = RouterContext<"/sentences/:id", { id: string }>;
async function remove(ctx: RemoveContext) {
  const id = getIdParamAsNumber(ctx.params.id);
  await handler.remove(id);

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
