const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 4173;
const ROOT = __dirname;

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

function resolveFile(urlPath) {
  const sanitized = urlPath.split("?")[0];
  const targetPath = sanitized === "/" ? "/index.html" : sanitized;
  const absolutePath = path.join(ROOT, targetPath);
  return absolutePath.startsWith(ROOT) ? absolutePath : path.join(ROOT, "index.html");
}

http
  .createServer((request, response) => {
    const filePath = resolveFile(request.url || "/");

    fs.readFile(filePath, (error, content) => {
      if (error) {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not found");
        return;
      }

      const extension = path.extname(filePath);
      const contentType = MIME_TYPES[extension] || "application/octet-stream";

      response.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": contentType
      });
      response.end(content);
    });
  })
  .listen(PORT, () => {
    console.log(`CRM dashboard running at http://localhost:${PORT}`);
  });
