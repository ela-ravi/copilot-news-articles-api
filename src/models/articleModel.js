const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  articleId: {
    type: String,
    required: true,
    unique: true,
  },
  published: {
    type: Date,
    default: null,
  },
  author: {
    authorId: String,
    authorName: String,
    authorImage: String,
  },
  category: {
    categoryId: String,
    categoryName: String,
  },
  tags: [String],
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  hero: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  mediaURL: {
    type: String,
  },
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
