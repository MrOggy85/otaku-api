import { Application, Router, SqliteError } from "./deps.ts";
import initChallengesRoutes from "./challenges/route.ts";
import initTagsRoutes from "./tags/route.ts";
import initSentencesRoutes from "./sentences/route.ts";
import initGuessRoutes from "./guess/route.ts";
import AppError from "./AppError.ts";

function initServer() {
  const app = new Application();

  app.addEventListener("error", (evt) => {
    console.error(evt.error);
  });

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      if (err instanceof SqliteError) {
        const sqliteError = err as SqliteError;
        ctx.response.status = 400;
        ctx.response.body = sqliteError.message;
        return;
      }

      if (err instanceof AppError) {
        const appError = err as AppError;
        ctx.response.status = appError.status;
        ctx.response.body = appError.message;
        return;
      }

      console.error(err);
      ctx.response.status = 500;
      ctx.response.body = "Internal Server Error";
    }
  });

  // Logger
  app.use(async (ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url}`);
    await next();
  });

  const router = new Router();
  router
    .get("/", (context) => {
      context.response.body = "Hello world!";
    });

  initChallengesRoutes(router);
  initSentencesRoutes(router);
  initTagsRoutes(router);
  initGuessRoutes(router);

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}

export default initServer;
