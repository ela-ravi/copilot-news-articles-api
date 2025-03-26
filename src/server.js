const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Article = require("./models/articleModel"); // Import the Article model

const authorsRoutes = require("./routes/authors");
const categoriesRoutes = require("./routes/categories");
const tagsRoutes = require("./routes/tags");
const articlesRoutes = require("./routes/articles");

const Author = require("./models/authorModel"); // Import the Author model
const NewsCategory = require("./models/newsCategoryModel"); // Import the Category model
const ArticleType = require("./models/articleTypeModel"); // Import the ArticleType model

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded form data
app.use(express.json()); // To parse JSON data

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/news-platform", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, // Add this option to fix the deprecation warning
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Routes
app.use("/authors", authorsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/tags", tagsRoutes);
app.use("/articles", articlesRoutes);

// Route for CMS Home Page
app.get("/", async (req, res) => {
  try {
    const articles = await Article.find();
    const authors = await Author.find();
    const categories = await NewsCategory.find();
    // Get all unique tags from the database
    const tags = [...new Set(articles.flatMap((article) => article.tags))];
    const successMessage = req.query.success || null;

    res.render("index", {
      articles,
      authors,
      categories,
      tags,
      successMessage,
    });
  } catch (err) {
    console.error("Error fetching data for home page:", err);
    res.status(500).send("Error fetching data for home page");
  }
});

// Route for Article Type Page
app.get("/article-type", async (req, res) => {
  try {
    const articleTypes = await ArticleType.find(); // Fetch all article types
    res.render("articleType", { articleTypes }); // Render the article type page with data
  } catch (err) {
    console.error("Error fetching article types:", err);
    res.status(500).send("Error fetching article types");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
