import AppError from "../AppError.ts";
import * as entity from "../db/repository/tag.ts";

export async function getAll() {
  const models = await entity.getAll();
  return models;
}

export async function getById(id: number) {
  const model = await entity.getById(id);
  if (!model) {
    throw new AppError("No Tag found", 400);
  }
  return model;
}

type Create = {
  name: string;
};

export async function create({ name }: Create) {
  await entity.create({
    name,
  });

  return true;
}

type Update = Create & {
  id: number;
  name: string;
};

export async function update({ id, name }: Update) {
  await entity.update({
    id,
    name,
  });

  return true;
}

export async function remove(id: number) {
  await entity.remove(id);

  return true;
}
