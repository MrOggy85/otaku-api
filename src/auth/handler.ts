import AppError from "../AppError.ts";
import * as entity from "../db/repository/user.ts";
import createPasswordHash from "../user/createPasswordHash.ts";

type LoginParams = {
  email: string;
  password: string;
};
export async function login({ email, password }: LoginParams) {
  const model = await entity.getByEmail(email);
  if (!model) {
    throw new AppError("Login Failed", 401);
  }

  const hashedPassword = createPasswordHash(password);
  if (hashedPassword !== model.password) {
    throw new AppError("Login Failed", 401);
  }

  return true;
}
