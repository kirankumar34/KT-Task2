const express = require("express");
require("./db");
const Book = require("./models/book");

const app = express();
app.use(express.json());

// Create book
app.post("/books", async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all books
app.get("/books", async (req, res) => {
  res.json(await Book.find());
});

// Books by category
app.get("/books/category/:cat", async (req, res) => {
  res.json(await Book.find({ category: req.params.cat }));
});

// Books after year
app.get("/books/after/:year", async (req, res) => {
  res.json(await Book.find({ year: { $gt: req.params.year } }));
});

// Update copies
app.put("/books/:id/copies", async (req, res) => {
  const { change } = req.body;
  const book = await Book.findById(req.params.id);

  if (!book) return res.status(404).json({ error: "Book not found" });
  if (book.copies + change < 0)
    return res.status(400).json({ error: "Negative stock not allowed" });

  book.copies += change;
  await book.save();
  res.json(book);
});

// Delete book if copies = 0
app.delete("/books/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) return res.status(404).json({ error: "Book not found" });
  if (book.copies !== 0)
    return res.status(400).json({ error: "Stock not zero" });

  await book.deleteOne();
  res.json({ message: "Book deleted" });
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
