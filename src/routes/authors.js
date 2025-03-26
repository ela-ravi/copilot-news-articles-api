const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const Author = require("../models/authorModel");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Route to render authors page
router.get("/", async (req, res) => {
  try {
    const authors = await Author.find();
    res.render("authors", { authors });
  } catch (err) {
    console.error("Error fetching authors:", err);
    res.status(500).send("Error fetching authors");
  }
});

// Route to handle adding a new author
router.post("/", upload.single("authorImage"), async (req, res) => {
  const { authorName } = req.body;
  const authorId = uuidv4();
  const authorImage = req.file ? `/uploads/${req.file.filename}` : null;

  const newAuthor = new Author({ authorId, authorName, authorImage });
  try {
    await newAuthor.save();
    res.redirect("/authors");
  } catch (err) {
    console.error("Error adding author:", err);
    res.status(500).send("Error adding author");
  }
});

// Route to handle editing an author
router.post("/edit/:id", upload.single("authorImage"), async (req, res) => {
  const { id } = req.params;
  const { authorName } = req.body;
  const authorImage = req.file ? `/uploads/${req.file.filename}` : undefined;

  const updateData = { authorName };
  if (authorImage) updateData.authorImage = authorImage;

  try {
    await Author.findByIdAndUpdate(id, updateData);
    res.redirect("/authors");
  } catch (err) {
    console.error("Error editing author:", err);
    res.status(500).send("Error editing author");
  }
});

// Route to handle deleting an author
router.post("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Author.findByIdAndDelete(id);
    res.redirect("/authors");
  } catch (err) {
    console.error("Error deleting author:", err);
    res.status(500).send("Error deleting author");
  }
});

module.exports = router;
