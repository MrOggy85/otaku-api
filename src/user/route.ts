import { Context, Router } from "../deps.ts";
import AppError from "../AppError.ts";
import { getIdParam } from "../routeValidation.ts";
import * as handler from "./handler.ts";

const ROUTE = "/user";

async function getAll(ctx: Context) {
  const models = await handler.getAll();
  ctx.response.body = models;
}

async function getById(ctx: Context) {
  const id = getIdParam(ctx);

  const model = await handler.getById(Number(id));
  ctx.response.body = model;
}

type InsertModel = {
  email?: string;
  password?: string;
};

async function insert(ctx: Context) {
  const result = ctx.request.body({
    type: "json",
  });
  const { email, password }: InsertModel = await result.value as InsertModel;
  if (!email || !password) {
    throw new AppError("wrong body", 400);
  }

  await handler.create({
    email,
    password,
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
  const { id, email, password }: UpdateModel = await result.value;
  if (!id) {
    throw new AppError('"id" is empty', 400);
  }
  const idAsNumber = Number(id);
  if (!Number.isInteger(idAsNumber)) {
    throw new AppError('"id" is not a number', 400);
  }
  if (!email) {
    throw new AppError('"email" is empty', 400);
  }
  if (!password) {
    throw new AppError('"password" is empty', 400);
  }

  handler.update({
    id: idAsNumber,
    email,
    password,
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
    .post(`${ROUTE}`, insert)
    .put(`${ROUTE}`, update)
    .delete(`${ROUTE}/:id`, remove);
}

export default init;
