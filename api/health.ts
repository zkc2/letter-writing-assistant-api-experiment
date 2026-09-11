import { app } from "../server";

export { app };
export default function handler(req: any, res: any) {
  if (req.url && !req.url.includes("/health")) {
    const queryIndex = req.url.indexOf("?");
    const query = queryIndex !== -1 ? req.url.slice(queryIndex) : "";
    req.url = `/api/health${query}`;
  }
  return app(req, res);
}
