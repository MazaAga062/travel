import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";

const rootDir = process.cwd();
const outDir = resolve(rootDir, "out");
const distDir = resolve(rootDir, "dist");
const clientDir = join(distDir, "client");
const serverDir = join(distDir, "server");
const hostingSource = resolve(rootDir, ".openai", "hosting.json");
const hostingTargetDir = join(distDir, ".openai");
const hostingTarget = join(hostingTargetDir, "hosting.json");

function listFiles(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...listFiles(absolutePath));
    } else if (entry.isFile()) {
      files.push(absolutePath);
    }
  }

  return files;
}

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

const assetEntries = listFiles(outDir).map((filePath) => {
  const routePath = `/${relative(outDir, filePath).split(sep).join("/")}`;
  const extension = extname(filePath).toLowerCase();
  const contentType = contentTypes.get(extension) ?? "application/octet-stream";
  const encoding = /^(text\/|application\/(javascript|json))/.test(contentType) ? "utf8" : null;
  const content = readFileSync(filePath);

  return {
    path: routePath === "/index.html" ? "/" : routePath,
    alternatePath: routePath,
    contentType,
    base64: content.toString("base64"),
    cacheControl: routePath.startsWith("/_next/static/")
      ? "public, max-age=31536000, immutable"
      : routePath.endsWith(".html")
        ? "no-cache"
        : "public, max-age=3600",
    size: statSync(filePath).size,
    isHtml: routePath.endsWith(".html"),
    encoding,
  };
});

const serializedAssets = JSON.stringify(assetEntries);

const serverSource = `const assetList = ${serializedAssets};

const assets = new Map();

for (const asset of assetList) {
  assets.set(asset.path, asset);
  if (asset.alternatePath && asset.alternatePath !== asset.path) {
    assets.set(asset.alternatePath, asset);
  }
}

function decodeBase64(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function resolveAsset(pathname) {
  if (assets.has(pathname)) {
    return assets.get(pathname);
  }

  if (assets.has(pathname + "/index.html")) {
    return assets.get(pathname + "/index.html");
  }

  if (assets.has(pathname + ".html")) {
    return assets.get(pathname + ".html");
  }

  return assets.get("/") ?? assets.get("/index.html") ?? null;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const asset = resolveAsset(url.pathname);

    if (!asset) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(decodeBase64(asset.base64), {
      status: 200,
      headers: {
        "content-type": asset.contentType,
        "cache-control": asset.cacheControl,
      },
    });
  },
};
`;

writeFileSync(join(serverDir, "index.js"), serverSource);
