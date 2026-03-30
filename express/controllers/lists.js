const { lists } = require("../models");

const getLists = (req, res) => {
  res.json(lists);
};

const createList = (req, res) => {
  const newList = {
    id: Date.now().toString(),
    name: req.body.name,
  };

  lists.push(newList);
  res.status(201).json(newList);
};

const updateList = (req, res) => {
  const list = lists.find((l) => l.id === req.params.id);

  if (!list) return res.status(404).send("list not found");

  list.name = req.body.name;
  res.json(list);
};

module.exports = { getLists, createList, updateList };
