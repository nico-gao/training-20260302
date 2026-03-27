// import { createServer } from "node:http";

// const hostname = "127.0.0.1";
// const port = 3001;

// // /todos
// const server = createServer((req, res) => {

//   if (req.url.startsWith('/todos/' && req.method === "GET")){
//   }
//   else if (req.url.startsWith('/lists' && req.method === "GET")){

//   }
//   else if (req.url.startsWith('/lists' && req.method === "POST")){

//   }
//   res.statusCode = 200;
//   res.setHeader("Content-Type", "text/plain");
//   res.end("Hello World");
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  console.log(req);
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
