import express from "express";
import crypto from "node:crypto";

const router = express.Router();

/**
 * {
 *    todos: [{}, {}, {} ],
 *    total: 123,
 *    skip: 0
 * }
 *
 */

const todos = [{ id: 1, title: "Eat Dinner", completed: false }];

// get all todos
router.get("/", (req, res) => {
  res.json(todos);
});

// get one todo
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  res.json(todo);
});

// create a new todo
router.post("/", (req, res) => {
  const newTodo = {
    id: crypto.randomUUID(),
    title: req.body.title,
    completed: false,
  };

  todos.push(newTodo);

  res.status(201).json(newTodo);
});

export default router;
