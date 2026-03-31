import {
  createListRecord,
  findListById,
  getLists as getAllLists,
  type List,
  updateListName,
} from "../models";

const getLists = async (): Promise<List[]> => {
  return getAllLists();
};

const createList = async (name: string): Promise<List> => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("List name is required");
  }

  return createListRecord(trimmedName);
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

export { createList, getLists, updateList };
