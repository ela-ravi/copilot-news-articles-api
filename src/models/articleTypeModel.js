const mongoose = require("mongoose");

const articleTypeSchema = new mongoose.Schema({
  articleType: {
    type: String,
    required: true,
    unique: true,
  },
});

const ArticleType = mongoose.model("ArticleType", articleTypeSchema);

module.exports = ArticleType;
