const express = require("express");
const router = express.Router();
const NewsCategory = require("../models/newsCategoryModel");
const { v4: uuidv4 } = require("uuid");

// Route to render categories page
router.get("/", async (req, res) => {
  try {
    const categories = await NewsCategory.find();
    res.render("categories", { categories });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).send("Error fetching categories");
  }
});

// Route to handle adding a new category
router.post("/", async (req, res) => {
  const { categoryName } = req.body;
  const categoryId = uuidv4();

  const newCategory = new NewsCategory({ categoryId, categoryName });
  try {
    await newCategory.save();
    res.redirect("/categories");
  } catch (err) {
    console.error("Error adding category:", err);
    res.status(500).send("Error adding category");
  }
});

// Route to handle deleting a category
router.post("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await NewsCategory.findByIdAndDelete(id);
    res.redirect("/categories");
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).send("Error deleting category");
  }
});

module.exports = router;
