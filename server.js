const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 3000;
const root = __dirname;
const types = {
  ".html":"text/html; charset=utf-8",
  ".css":"text/css; charset=utf-8",
  ".js":"application/javascript; charset=utf-8",
  ".json":"application/json; charset=utf-8",
  ".svg":"image/svg+xml",
  ".png":"image/png",
  ".jpg":"image/jpeg",
  ".jpeg":"image/jpeg",
  ".webp":"image/webp",
  ".ico":"image/x-icon"
};

http.createServer((req,res)=>{
  let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";
  const safePath = path.normalize(urlPath).replace(/^(..[/\\])+/, "");
  const filePath = path.join(root, safePath);
  if (!filePath.startsWith(root)) {
    res.writeHead(403); res.end("Forbidden"); return;
  }
  fs.stat(filePath,(err,stat)=>{
    const target = !err && stat.isDirectory() ? path.join(filePath,"index.html") : filePath;
    fs.readFile(target,(readErr,data)=>{
      if(readErr){res.writeHead(404,{"Content-Type":"text/plain; charset=utf-8"});res.end("Not found");return;}
      res.writeHead(200,{"Content-Type":types[path.extname(target).toLowerCase()]||"application/octet-stream","Cache-Control":"no-cache"});
      res.end(data);
    });
  });
}).listen(port,"0.0.0.0",()=>console.log("Nuclear Physics Lab running on port "+port));
