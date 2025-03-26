const express = require("express");
const router = express.Router();
const Tag = require("../models/tagModel");

// Route to render tags page
router.get("/", async (req, res) => {
  try {
    const tags = await Tag.find();
    res.render("tags", { tags });
  } catch (err) {
    console.error("Error fetching tags:", err);
    res.status(500).send("Error fetching tags");
  }
});

// Route to handle adding a new tag
router.post("/", async (req, res) => {
  const { tagName } = req.body;

  const newTag = new Tag({ tagName });
  try {
    await newTag.save();
    res.redirect("/tags");
  } catch (err) {
    console.error("Error adding tag:", err);
    res.status(500).send("Error adding tag");
  }
});

// Route to handle deleting a tag
router.post("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Tag.findByIdAndDelete(id);
    res.redirect("/tags");
  } catch (err) {
    console.error("Error deleting tag:", err);
    res.status(500).send("Error deleting tag");
  }
});

module.exports = router;
