import type { Router } from "./deps.ts";

type Get = Router["get"];
type Middeware = Parameters<Get>[1];
export type Context = Parameters<Middeware>[0];
