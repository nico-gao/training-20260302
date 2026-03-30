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
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import todosRoute from "./routes/todos.js";

const app = express();
app.use(express.json());
const port = 3000;

const JWT_SECRET = "THIS_IS_A_SECRET";

const users = [];

app.use("/api/todos", logger, authMiddleware, todosRoute);

function logger(req, res, next) {
  console.log("recceived a request");
  next();
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization; // Bearer token

  if (!authHeader)
    return res.status(401).json({ message: "Missing authorization header" });
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    console.log(payload);

    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: "invalid token" });
  }
}
// req -> middleware -> middleware -> res

// authorization

// JWT
// header.payload.signature, secret, integrity

// client -> login -> server
// server -> token -> client
// client -> access data request (token) -> server (verify token)
// server -> data -> client

app.get("/", (req, res) => {
  // console.log(req);
  res.send("Hello World!");
});

app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  const hasedPassword = bcrypt.hashSync(password, 10);

  const userExisted = users.some((user) => user.email === email);

  if (userExisted) {
    return res.status(400).json({ message: "user already exists" });
  }

  users.push({
    id: crypto.randomUUID(),
    email,
    password: hasedPassword,
  });

  res.status(201).json({ message: "user created successfully" });
});

// authentication
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((user) => user.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "invalid credential" });
  }

  const jwtoken = jwt.sign(user, JWT_SECRET, { expiresIn: "30s" });
  console.log(jwtoken);

  res.status(200).json({ message: "login successful", token: jwtoken });
  // request header: Authorization
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
