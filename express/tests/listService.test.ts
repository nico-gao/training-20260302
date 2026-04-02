import { createListRecord, resetDatabase } from "../models";
import {
  createList,
  createTodo,
  getLists,
  updateList,
} from "../services/listService";

describe("listService", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("creates a list with trimmed whitespace", async () => {
    const list = await createList("  Groceries  ");

    expect(list.name).toBe("Groceries");
    await expect(getLists()).resolves.toEqual([
      expect.objectContaining({ id: list.id, name: "Groceries" }),
    ]);
  });

  it("rejects an empty list name", async () => {
    await expect(createList("   ")).rejects.toThrow("List name is required");
  });

  it("updates an existing list with trimmed whitespace", async () => {
    const list = await createListRecord("Original");

    const updatedList = await updateList(list.id, "  Updated  ");

    expect(updatedList).toEqual({ id: list.id, name: "Updated" });
  });

  it("rejects updates for missing lists", async () => {
    await expect(updateList("missing-id", "Updated")).rejects.toThrow(
      "List not found",
    );
  });

  it("creates a todo under an existing list", async () => {
    const list = await createListRecord("Groceries");

    const todo = await createTodo(list.id, "  Buy milk  ");
    const lists = await getLists();

    expect(todo).toEqual(
      expect.objectContaining({
        listId: list.id,
        name: "Buy milk",
        completed: false,
      }),
    );
    expect(lists).toEqual([
      expect.objectContaining({
        id: list.id,
        name: "Groceries",
        todos: [expect.objectContaining({ name: "Buy milk" })],
      }),
    ]);
  });

  it("rejects todos for a missing list", async () => {
    await expect(createTodo("missing-id", "Buy milk")).rejects.toThrow(
      "List not found",
    );
  });
});
