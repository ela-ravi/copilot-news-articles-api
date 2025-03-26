const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const Article = require("../models/articleModel");
const Author = require("../models/authorModel"); // Import the Author model
const NewsCategory = require("../models/newsCategoryModel");

// Configure multer
const upload = multer();

// Route to handle adding a news article
router.post("/", upload.none(), async (req, res) => {
  console.log("DEBUG articles route:::", req.body); // Debugging: Log the incoming form data

  const {
    title,
    subtitle,
    author,
    category,
    tags,
    articleType,
    description,
    mediaURL,
    hero,
    action,
  } = req.body;

  const articleId = uuidv4();
  const published = action === "publish" ? new Date() : null;

  const newArticle = new Article({
    articleId,
    published,
    author,
    category,
    tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    title,
    subtitle,
    hero,
    description: articleType === "text" ? description : null,
    mediaURL: articleType !== "text" ? mediaURL : null,
  });

  try {
    await newArticle.save();
    res.redirect("/");
  } catch (err) {
    console.error("Error saving article:", err);
    res.status(500).send("Error saving article");
  }
});

router.post("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, author, category, tags, hero, description, action } =
    req.body;

  try {
    const updateData = {
      title,
      subtitle,
      author,
      category,
      tags: tags
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        : [],
      hero,
      description,
    };

    // If the action is "publish", set the published date
    if (action === "publish") {
      updateData.published = new Date();
    }

    const updatedArticle = await Article.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedArticle) {
      return res.status(404).json({
        status: 0,
        message: "Article not found",
      });
    }

    res.status(200).json({
      status: 1,
      message:
        action === "publish"
          ? "Article published successfully!"
          : "Article saved successfully!",
    });
  } catch (err) {
    console.error("Error editing article:", err);
    res.status(500).json({
      status: 0,
      message: "Error editing article",
    });
  }
});

router.post("/publish/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Article.findByIdAndUpdate(id, { published: new Date() });
    res.status(200).send("Article published successfully");
  } catch (err) {
    console.error("Error publishing article:", err);
    res.status(500).send("Error publishing article");
  }
});

router.get("/edit/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    const authors = await Author.find();
    const categories = await NewsCategory.find();

    // Get all unique tags from the database
    const allArticles = await Article.find();
    const tags = [...new Set(allArticles.flatMap((article) => article.tags))];

    res.render("edit", {
      article,
      authors,
      categories,
      tags,
    });
  } catch (err) {
    console.error("Error fetching article for editing:", err);
    res.status(500).send("Error fetching article for editing");
  }
});

router.get("/list", async (req, res) => {
  try {
    const {
      page = 1,
      categoryId = null,
      tag = null,
      authorName = null,
    } = req.query;

    const query = { published: { $ne: null } }; // Only include published articles
    if (categoryId) query["category.categoryId"] = categoryId;
    if (tag) query.tags = tag;
    if (authorName) query["author.authorName"] = authorName;

    const limit = 10;
    const skip = (page - 1) * limit;

    const articles = await Article.find(query)
      .skip(skip)
      .limit(limit)
      .select(
        "title hero articleId category.categoryId author.authorId articleType tags"
      )
      .lean();

    res.json({
      status: 1,
      message: "success",
      data: {
        page: parseInt(page),
        categoryId,
        tag,
        authorName,
        articles,
      },
    });
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({
      status: 0,
      message: "Error fetching articles",
    });
  }
});
router.post("/delete/:id", async (req, res) => {
  console.log("Delete:", req.body);
  const { id } = req.params;
  try {
    const deleteArticle = await Article.findByIdAndDelete(id);
    if (!deleteArticle) {
      console.error("Article not found for deleting");
      return res.status(404).send("Article not found");
    }
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting article:", err);
    res.status(500).send("Error deleting article");
  }
});

module.exports = router;
