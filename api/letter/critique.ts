import app, { app as namedApp } from "../../server.js";

const expressApp = namedApp || app;

export { expressApp as app };
export default function handler(req: any, res: any) {
  if (req.url && !req.url.includes("/letter/critique")) {
    const queryIndex = req.url.indexOf("?");
    const query = queryIndex !== -1 ? req.url.slice(queryIndex) : "";
    req.url = `/api/letter/critique${query}`;
  }
  return expressApp(req, res);
}
