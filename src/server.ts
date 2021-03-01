import initChallengesRoutes from "./challenges/route.ts";
import initTagsRoutes from "./tags/route.ts";
import initSentencesRoutes from "./sentences/route.ts";
import { Application, HttpError, isHttpError, Router } from "./deps.ts";

function initServer() {
  const app = new Application();

  app.addEventListener("error", (evt) => {
    console.error(evt.error);
  });

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      if (isHttpError(err)) {
        const httpError = err as HttpError;
        ctx.response.status = httpError.status;
        ctx.response.body = httpError.message;
      } else {
        console.error(err);
        ctx.response.status = 500;
        ctx.response.body = "Internal Server Error";
      }
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

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}

export default initServer;
