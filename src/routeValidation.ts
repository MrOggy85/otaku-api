import { Context, helpers } from "./deps.ts";
import AppError from './AppError.ts';

export function getIdParam(ctx: Context) {
  const id = helpers.getQuery(ctx).id;
  if (!id) {
    throw new AppError('no id provided', 400);
  }
  const idAsNumber = Number(id);
  if (!Number.isInteger(idAsNumber)) {
    throw new AppError('"id" is not a number', 400);
  }

  return idAsNumber;
}
