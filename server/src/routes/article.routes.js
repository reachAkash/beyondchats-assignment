const express = require("express");
const Article = require("../models/Article");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { scrapeAndStore } = require("../controllers/article.controller");

const router = express.Router();

router.post("/scrape", scrapeAndStore);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const article = await Article.findById(req.params.id);
    if (!article) throw new AppError("Article not found", 404);
    res.json(article);
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const updated = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) throw new AppError("Article not found", 404);
    res.json(updated);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deleted = await Article.findByIdAndDelete(req.params.id);
    if (!deleted) throw new AppError("Article not found", 404);
    res.json({ message: "Deleted" });
  })
);

module.exports = router;
