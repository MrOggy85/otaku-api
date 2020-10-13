import { init as initChallengesRoutes } from "./routes/challenges.ts";
import { init as initSentencesRoutes } from "./routes/sentences.ts";
import { Application, Router, config } from "./deps.ts";
import { printDiagnostic } from './debug/diagnostics.ts';
import initDb from "./db/init.ts";

if (config().RUN_DIAGNOSTICS === '1') {
  printDiagnostic();
}

initDb();

const app = new Application();

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

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
