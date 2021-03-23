import { createHash } from "../deps.ts";

function createPasswordHash(password: string) {
  const hashedPassword = createHash("sha256")
    .update(password)
    .digest("hex") as string;

  return hashedPassword;
}

export default createPasswordHash;
