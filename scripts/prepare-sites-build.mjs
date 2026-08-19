import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";

const rootDir = process.cwd();
const outDir = resolve(rootDir, "out");
const distDir = resolve(rootDir, "dist");
const clientDir = join(distDir, "client");
const serverDir = join(distDir, "server");
const hostingSource = resolve(rootDir, ".openai", "hosting.json");
const hostingTargetDir = join(distDir, ".openai");
const hostingTarget = join(hostingTargetDir, "hosting.json");

if (!existsSync(outDir)) {
  throw new Error("Expected Next export output in ./out, but it was not found.");
}

rmSync(distDir, { force: true, recursive: true });
mkdirSync(clientDir, { recursive: true });
mkdirSync(serverDir, { recursive: true });
mkdirSync(hostingTargetDir, { recursive: true });

cpSync(outDir, clientDir, { recursive: true });

if (existsSync(hostingSource)) {
  copyFileSync(hostingSource, hostingTarget);
} else {
  writeFileSync(hostingTarget, JSON.stringify({}, null, 2));
}

const serverSource = `import { createReadStream, existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import http from "node:http";

const clientDir = join(process.cwd(), "dist", "client");
const port = Number.parseInt(process.env.PORT ?? "3000", 10);

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".js", "application/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".mjs", "application/javascript; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

function resolveCandidate(pathname) {
  const safePath = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\\\])+/, "");
  const directPath = join(clientDir, safePath);

  if (existsSync(directPath) && extname(directPath)) {
    return directPath;
  }

  if (existsSync(join(clientDir, safePath, "index.html"))) {
    return join(clientDir, safePath, "index.html");
  }

  if (existsSync(join(clientDir, safePath + ".html"))) {
    return join(clientDir, safePath + ".html");
  }

  return join(clientDir, "index.html");
}

http
  .createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const candidate = resolveCandidate(url.pathname === "/" ? "/index.html" : url.pathname);
    const extension = extname(candidate).toLowerCase();
    const contentType = contentTypes.get(extension) ?? "application/octet-stream";

    res.setHeader("Content-Type", contentType);

    if (candidate.endsWith(".html")) {
      res.setHeader("Cache-Control", "no-cache");
    } else if (url.pathname.startsWith("/_next/static/")) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    }

    const stream = createReadStream(candidate);
    stream.on("error", () => {
      res.statusCode = 404;
      res.end("Not found");
    });
    stream.pipe(res);
  })
  .listen(port, () => {
    console.log("Sites server listening on port", port);
  });
`;

writeFileSync(join(serverDir, "index.js"), serverSource);
