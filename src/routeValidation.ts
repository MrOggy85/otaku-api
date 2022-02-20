import AppError from "./AppError.ts";

export function getIdParamAsNumber(id: string | undefined) {
  if (!id) {
    throw new AppError("no id provided", 400);
  }
  const idAsNumber = Number(id);
  if (!Number.isInteger(idAsNumber)) {
    throw new AppError('"id" is not a number', 400);
  }

  return idAsNumber;
}
