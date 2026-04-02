import type { Request, Response } from "express";

import * as listService from "../services/listService";

const getLists = async (req: Request, res: Response): Promise<void> => {
  void req;
  const lists = await listService.getLists();
  res.json(lists);
};

const createList = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body as { name?: string };

  if (!name) {
    res.status(400).json({ message: "List name is required" });
    return;
  }

  try {
    const newList = await listService.createList(name);
    res.status(201).json(newList);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create list";
    const status = message === "List name is required" ? 400 : 500;
    res.status(status).json({ message });
  }
};

const updateList = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body as { name?: string };
  const listId = String(req.params.id);

  if (!name) {
    res.status(400).json({ message: "List name is required" });
    return;
  }

  try {
    const updatedList = await listService.updateList(listId, name);
    res.json(updatedList);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update list";
    const status =
      message === "List name is required"
        ? 400
        : message === "List not found"
          ? 404
          : 500;
    res.status(status).json({ message });
  }
};

const createTodo = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body as { name?: string };
  const listId = String(req.params.id);

  if (!name) {
    res.status(400).json({ message: "Todo name is required" });
    return;
  }

  try {
    const todo = await listService.createTodo(listId, name);
    res.status(201).json(todo);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create todo";
    const status =
      message === "Todo name is required"
        ? 400
        : message === "List not found"
          ? 404
          : 500;
    res.status(status).json({ message });
  }
};

export { getLists, createList, updateList, createTodo };
