import { Context, createHash, Router, uuid } from "../deps.ts";
import AppError from "../AppError.ts";
import * as handler from "./handler.ts";

const ROUTE = "/auth";

const authenticatedUsers: Record<string, string> = {};

type LoginModel = {
  email?: string;
  password?: string;
};

function createAuthToken() {
  const generatedUuid = uuid.generate();

  const hash = createHash("sha256")
    .update(generatedUuid)
    .digest("hex") as string;

  return hash;
}

async function getJsonBody<T>(ctx: Context) {
  try {
    const result = ctx.request.body({
      type: "json",
    });
    const body = await result.value;
    return body as T;
  } catch (error) {
    throw new AppError(error.message, 400);
  }
}

async function login(ctx: Context) {
  const body = await getJsonBody<LoginModel>(ctx);
  const { email, password } = body;
  if (!email) {
    throw new AppError('"email" is empty', 400);
  }
  if (!password) {
    throw new AppError('"password" is empty', 400);
  }

  await handler.login({ email, password });

  const authToken = createAuthToken();
  console.log("new authToken", authToken);
  authenticatedUsers[authToken] = email;
  ctx.cookies.set("tomato", authToken);

  ctx.response.status = 200;
}

async function authTest(ctx: Context) {
  const authToken = await ctx.cookies.get("tomato");
  if (!authToken) {
    throw new AppError("No authToken found. Please Login", 401);
  }

  const user = authenticatedUsers[authToken];
  if (!user) {
    throw new AppError("Auth Failed. Please Login", 401);
  }

  ctx.response.status = 200;
}

function init(router: Router) {
  router
    .post(`${ROUTE}/login`, login)
    .get(`${ROUTE}/test`, authTest);
}

export default init;
