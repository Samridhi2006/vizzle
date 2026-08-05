// Vercel serverless function: same-origin bridge for the API docs "Try it out" playground.
//
// The real API lives on a different domain (dashboard.vizzle.in) and only allows
// browser requests whose Origin matches the calling store's own registered domain
// (see vizzle-api-platform/src/server/cors.ts). A docs page served from www.vizzle.in
// can't call it directly from the browser. This function forwards the request
// server-to-server instead (no Origin header sent, which the API already allows),
// so the browser only ever talks to its own origin.
//
// Deliberately has NO Access-Control-Allow-Origin header: without it, a third-party
// site cannot use this as a public CORS-bypass proxy — the browser blocks the
// preflight for any cross-origin caller. Only pages served from this same origin
// (i.e. our own docs page) can use it.

const UPSTREAM_HOST = "https://dashboard.vizzle.in";

async function readRawBody(req) {
  // If Vercel already parsed a JSON/urlencoded body, re-serialize it.
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === "string" && req.body.length > 0) return Buffer.from(req.body);
  if (req.body && typeof req.body === "object" && Object.keys(req.body).length > 0) {
    return Buffer.from(JSON.stringify(req.body));
  }
  // Otherwise (e.g. multipart/form-data for the upload endpoint) read the raw stream.
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  const { path } = req.query;
  if (!path || !Array.isArray(path) || path.length === 0) {
    res.status(400).json({ error: "Invalid proxy path" });
    return;
  }

  const upstreamUrl = `${UPSTREAM_HOST}/${path.join("/")}`;
  const method = req.method || "GET";

  const headers = {};
  if (req.headers["x-api-key"]) headers["x-api-key"] = req.headers["x-api-key"];
  if (req.headers["x-vizzle-user"]) headers["x-vizzle-user"] = req.headers["x-vizzle-user"];
  if (req.headers["content-type"]) headers["content-type"] = req.headers["content-type"];

  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? await readRawBody(req) : undefined;

  let upstream;
  try {
    upstream = await fetch(upstreamUrl, { method, headers, body });
  } catch (err) {
    res.status(502).json({ error: "Proxy request to the Vizzle API failed", details: String(err) });
    return;
  }

  const contentType = upstream.headers.get("content-type") || "application/json";
  const buf = Buffer.from(await upstream.arrayBuffer());

  res.status(upstream.status);
  res.setHeader("content-type", contentType);
  res.send(buf);
}
