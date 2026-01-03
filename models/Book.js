const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: String,
  year: Number,
  copies: {
    type: Number,
    min: [0, "Stock cannot be negative"]
  },
  price: Number
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
