import { config } from "./deps.ts";

type KEY = 'DB_USER' | 'DB_PASSWORD' | 'DB_NAME' | 'DB_HOST' | 'DB_PORT' | 'RUN_DIAGNOSTICS' | 'DB_LOG_QUERY'

const env = config();

function getEnv(key: KEY) {
  return env[key] || '';
}

export default getEnv;
