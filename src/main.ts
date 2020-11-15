import { init as initChallengesRoutes } from "./routes/challenges.ts";
import { init as initSentencesRoutes } from "./routes/sentences.ts";
import { init as initTagsRoutes } from "./routes/tags.ts";
import { Application, Router, config, isHttpError, HttpError } from "./deps.ts";
import { printDiagnostic } from './debug/diagnostics.ts';
import initDb from "./db/init.ts";

if (config().RUN_DIAGNOSTICS === '1') {
  printDiagnostic();
}

initDb();

const app = new Application();

app.addEventListener("error", (evt) => {
  // Will log the thrown error to the console.
  console.log(evt.error);
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (isHttpError(err)) {
      const httpError = err as HttpError
      ctx.response.status = httpError.status
      ctx.response.body = httpError.message
    } else {
      // rethrow if you can't handle the error
      throw err;
    }
  }
});

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
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

await app.listen({ port: 8000 });
