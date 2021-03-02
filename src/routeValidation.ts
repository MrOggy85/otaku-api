import type { Context } from "./types.ts";

export function getIdParam(ctx: Context) {
  const id = ctx.params.id;
  if (!id) {
    ctx.throw(400, "no id provided");
  }
  const idAsNumber = Number(id);
  if (!Number.isInteger(idAsNumber)) {
    ctx.throw(400, '"id" is not a number');
  }

  return idAsNumber;
}
