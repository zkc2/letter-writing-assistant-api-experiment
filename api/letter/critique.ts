import { app } from "../../server";

export { app };
export default function handler(req: any, res: any) {
  if (req.url && !req.url.includes("/letter/critique")) {
    const queryIndex = req.url.indexOf("?");
    const query = queryIndex !== -1 ? req.url.slice(queryIndex) : "";
    req.url = `/api/letter/critique${query}`;
  }
  return app(req, res);
}
