// get / -  get all lists, post / - create new list, patch /:id - update list
const express = require("express");
const router = express.Router();
const listsController = require("../controllers/lists");
const { authMiddleware } = require("../middlewares/auth");

router.use(authMiddleware);

router.get("/", listsController.getLists);
router.post("/", listsController.createList);
router.post("/:id", listsController.updateList);

module.exports = router;
