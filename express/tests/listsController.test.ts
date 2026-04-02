import type { Request } from "express";

import { createList, createTodo, updateList } from "../controllers/lists";
import { createListRecord, getLists, resetDatabase } from "../models";
import { createMockResponse } from "./helpers/mockResponse";

describe("lists controller", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("returns 400 when the list name is missing", async () => {
    const req = {
      body: {},
    } as Request;
    const res = createMockResponse();

    await createList(req, res as never);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "List name is required" });
    await expect(getLists()).resolves.toHaveLength(0);
  });

  it("returns 404 when the target list does not exist", async () => {
    const req = {
      body: { name: "Renamed" },
      params: { id: "missing-id" },
    } as unknown as Request;
    const res = createMockResponse();

    await updateList(req, res as never);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: "List not found" });
  });

  it("changes the list name when the list exists", async () => {
    const list = await createListRecord("Original");
    const req = {
      body: { name: "Updated" },
      params: { id: list.id },
    } as unknown as Request;
    const res = createMockResponse();

    await updateList(req, res as never);
    const updatedLists = await getLists();

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ id: list.id, name: "Updated" });
    expect(updatedLists[0]?.name).toBe("Updated");
  });

  it("returns 400 when the todo name is missing", async () => {
    const list = await createListRecord("Groceries");
    const req = {
      body: {},
      params: { id: list.id },
    } as unknown as Request;
    const res = createMockResponse();

    await createTodo(req, res as never);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "Todo name is required" });
  });
});
