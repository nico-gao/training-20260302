import {
  createListRecord,
  createTodoRecord,
  findListById,
  getListsWithTodos as getAllListsWithTodos,
  type List,
  type ListWithTodos,
  type Todo,
  updateListName,
} from "../models";

const getLists = async (): Promise<ListWithTodos[]> => {
  return getAllListsWithTodos();
};

const createList = async (name: string): Promise<ListWithTodos> => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("List name is required");
  }

  const list = await createListRecord(trimmedName);

  return {
    ...list,
    todos: [],
  };
};

const updateList = async (id: string, name: string): Promise<List> => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("List name is required");
  }

  const existingList = await findListById(id);

  if (!existingList) {
    throw new Error("List not found");
  }

  const updatedList = await updateListName(id, trimmedName);

  if (!updatedList) {
    throw new Error("List not found");
  }

  return updatedList;
};

const createTodo = async (listId: string, name: string): Promise<Todo> => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("Todo name is required");
  }

  const existingList = await findListById(listId);

  if (!existingList) {
    throw new Error("List not found");
  }

  return createTodoRecord(listId, trimmedName);
};

export { createList, createTodo, getLists, updateList };
