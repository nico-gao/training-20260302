import express from "express";

import { createList, createTodo, getLists, updateList } from "../controllers/lists";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

router.use(authMiddleware);

/**
 * @openapi
 * /lists:
 *   get:
 *     summary: Get all lists
 *     tags:
 *       - Lists
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all lists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/List'
 *       401:
 *         description: Missing or invalid access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", getLists);

/**
 * @openapi
 * /lists:
 *   post:
 *     summary: Create a new list
 *     tags:
 *       - Lists
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ListInput'
 *     responses:
 *       201:
 *         description: List created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 *       400:
 *         description: Missing list name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Missing or invalid access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", createList);

/**
 * @openapi
 * /lists/{id}:
 *   post:
 *     summary: Update an existing list name
 *     tags:
 *       - Lists
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ListInput'
 *     responses:
 *       200:
 *         description: Updated list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 *       400:
 *         description: Missing list name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Missing or invalid access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: List not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/:id", updateList);

/**
 * @openapi
 * /lists/{id}/todos:
 *   post:
 *     summary: Create a new todo item inside a list
 *     tags:
 *       - Lists
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoInput'
 *     responses:
 *       201:
 *         description: Todo created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Missing todo name
 *       404:
 *         description: List not found
 */
router.post("/:id/todos", createTodo);

export default router;
