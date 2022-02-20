import AppError from "../AppError.ts";
import { Context, Router, RouterContext } from "../deps.ts";
import { getIdParamAsNumber } from "../routeValidation.ts";
import * as handler from "./handler.ts";

const ROUTE = "/challenges";

async function getAll(ctx: Context) {
  const models = await handler.getAll();

  ctx.response.body = models;
}

type GetByIdContext = RouterContext<"/challenges/:id", { id: string }>;
async function getById(ctx: GetByIdContext) {
  const id = getIdParamAsNumber(ctx.params.id);

  const model = await handler.getById(id);
  ctx.response.body = model;
}

type GetSentencesContext = RouterContext<
  "/challenges/:id/sentences",
  { id: string }
>;
async function getSentences(ctx: GetSentencesContext) {
  const id = getIdParamAsNumber(ctx.params.id);

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

  const idAsNumber = getIdParamAsNumber(id);

  if (!name) {
    throw new AppError('"name" is empty', 400);
  }
  if (!Array.isArray(tagIds)) {
    throw new AppError('"tagIds" is not an array', 400);
  }

  handler.update({
    id: idAsNumber,
    name,
    tagIds,
  });

  ctx.response.body = true;
}

type RemoveContext = RouterContext<"/challenges/:id", { id: string }>;
async function remove(ctx: RemoveContext) {
  const id = getIdParamAsNumber(ctx.params.id);

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
