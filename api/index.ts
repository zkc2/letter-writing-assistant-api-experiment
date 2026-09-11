import app, { app as namedApp } from "../server.js";

const expressApp = namedApp || app;

export { expressApp as app };
export default function handler(req: any, res: any) {
  return expressApp(req, res);
}
