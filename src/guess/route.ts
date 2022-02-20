import { Context, Router, RouterContext } from "../deps.ts";
import AppError from "../AppError.ts";
import { getIdParamAsNumber } from "../routeValidation.ts";
import * as handler from "./handler.ts";

const ROUTE = "/guess";

async function getAll(ctx: Context) {
  const models = await handler.getAll();
  ctx.response.body = models;
}

type GetByIdContext = RouterContext<"/guess/:id", { id: string }>;
async function getById(ctx: GetByIdContext) {
  const id = getIdParamAsNumber(ctx.params.id);

  const model = await handler.getById(Number(id));
  ctx.response.body = model;
}

type InsertModel = {
  sentenceId?: string;
  challengeId?: string;
  correct?: boolean;
};

async function insert(ctx: Context) {
  const result = ctx.request.body({
    type: "json",
  });
  const { sentenceId, challengeId, correct }: InsertModel = await result
    .value as InsertModel;
  if (!sentenceId || !challengeId || correct === undefined) {
    throw new AppError("wrong body", 400);
  }

  await handler.create({
    sentenceId: Number(sentenceId),
    challengeId: Number(challengeId),
    correct,
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
  const { id, sentenceId, challengeId, correct }: UpdateModel = await result
    .value;

  const idAsNumber = getIdParamAsNumber(id);

  if (!sentenceId) {
    throw new AppError('"sentenceId" is empty', 400);
  }
  if (!challengeId) {
    throw new AppError('"challengeId" is empty', 400);
  }
  if (correct === undefined) {
    throw new AppError('"correct" is empty', 400);
  }

  handler.update({
    id: idAsNumber,
    sentenceId: Number(sentenceId),
    challengeId: Number(challengeId),
    correct,
  });

  ctx.response.body = true;
}

type RemoveContext = RouterContext<"/guess/:id", { id: string }>;
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
