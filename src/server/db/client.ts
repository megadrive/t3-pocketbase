// src/server/db/client.ts
import Pocketbase from "pocketbase";
import { env } from "../../env/server.mjs";

declare global {
  // eslint-disable-next-line no-var
  var pocketbase: Pocketbase | undefined;
}

export const pocketbase =
  global.pocketbase ||
  new Pocketbase(env.DATABASE_URL ?? "http://127.0.0.1:8090");

if (env.NODE_ENV !== "production") {
  global.pocketbase = pocketbase;
}
