import { init } from "./challenges.ts";
import { getChallengeByKey, getChallenges, initDB, insertChallenge } from "./db.ts";
import { Application, Router, config } from "./deps.ts";
import { printDiagnostic } from './diagnostics.ts';
import { challenges } from './exampleData.ts';

if (config().RUN_DIAGNOSTICS === '1') {
  printDiagnostic();
}

initDB();

const b = getChallengeByKey('Banana');
console.log('challenge banana', b);

challenges.forEach(x => {
  const challenge = getChallengeByKey(x.key);
  console.log('challenge', challenge);
  if (!challenge) {
    insertChallenge(x);
  }
});

const hej = getChallenges();
console.log('hej', hej);

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

init(router);

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
