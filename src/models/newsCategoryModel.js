const mongoose = require("mongoose");

const newsCategorySchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true,
    unique: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
});

const NewsCategory = mongoose.model("NewsCategory", newsCategorySchema);

module.exports = NewsCategory;
