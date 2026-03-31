import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  void req;
  res.render("index", { title: "Express" });
});

export default router;
