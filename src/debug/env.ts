import { config } from "../deps.ts";

type ENF_FILE = {
  RUN_DIAGNOSTICS: boolean;
  DB_LOG_QUERY: boolean;
};

const env = {
  RUN_DIAGNOSTICS: false,
  DB_LOG_QUERY: false,
};

function init() {
  const RUN_DIAGNOSTICS = config().RUN_DIAGNOSTICS;
  console.log(`RUN_DIAGNOSTICS is: ${RUN_DIAGNOSTICS}`);

  env.RUN_DIAGNOSTICS = RUN_DIAGNOSTICS === "1";

  const DB_LOG_QUERY = config().DB_LOG_QUERY;
  console.log(`DB_LOG_QUERY is: ${DB_LOG_QUERY}`);

  env.DB_LOG_QUERY = DB_LOG_QUERY === "1";

  console.log("env initialized with:", env);
}

export function get(key: keyof ENF_FILE) {
  return env[key];
}

init();
