import { Model } from "../../deps.ts";
import { User } from "../models.ts";

type UserModel = {
  id: number;
  email: string;
} & Model;

type UserModelFull = UserModel & {
  password: string;
};

const FIELD = {
  ID: User.field("id"),
  EMAIL: User.field("email"),
  PASSWORD: User.field("password"),
};

export async function getAll() {
  const entity = await User.select(User.field("id"), User.field("email"))
    .all();
  return entity as unknown as UserModel[];
}

export async function getById(id: number) {
  const entity = await User
    .select(User.field("id"), User.field("email"))
    .where("id", id)
    .first();
  return entity as unknown as UserModel | undefined;
}

export async function getByEmail(email: UserModel["email"]) {
  const entity = await User
    // .select(FIELD.EMAIL, )
    .where(FIELD.EMAIL, email)
    .first();
  return entity as unknown as UserModelFull | undefined;
}

type Create = {
  email: UserModelFull["email"];
  password: UserModelFull["password"];
};

export async function create({ email, password }: Create) {
  await User.create({
    email,
    password,
  });
}

type Update = Create & {
  id: UserModelFull["id"];
};

export async function update({ id, email, password }: Update) {
  await User.where("id", id).update({
    email,
    password,
  });
}

export async function remove(id: UserModel["id"]) {
  await User.deleteById(id);
}
