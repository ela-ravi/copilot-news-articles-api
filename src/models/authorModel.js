const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  authorId: {
    type: String,
    required: true,
    unique: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  authorImage: {
    type: String, // Path to the uploaded image
    required: false,
  },
});

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
