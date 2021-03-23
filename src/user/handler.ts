import AppError from "../AppError.ts";
import * as entity from "../db/repository/user.ts";
import createPasswordHash from "./createPasswordHash.ts";

export async function getAll() {
  const models = await entity.getAll();
  return models;
}

export async function getById(id: number) {
  const model = await entity.getById(id);
  if (!model) {
    throw new AppError("No User found", 400);
  }
  return model;
}

type Create = Parameters<typeof entity.create>[0];

export async function create({ email, password }: Create) {
  const hashedPassword = createPasswordHash(password);

  await entity.create({
    email,
    password: hashedPassword,
  });

  return true;
}

type Update = Create & {
  id: number;
};

export async function update({ id, email, password }: Update) {
  await entity.update({
    id,
    email,
    password,
  });

  return true;
}

export async function remove(id: number) {
  await entity.remove(id);

  return true;
}
