
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered. You can now login." });
});

// Task 10: Get all books using async/await with Axios
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Get book by ISBN using Promise with Axios
public_users.get('/isbn/:isbn', (req, res) => {
  axios.get(`http://localhost:5000/isbn/${req.params.isbn}`)
    .then(response => res.status(200).json(response.data))
    .catch(err => res.status(404).json({ message: "Book not found" }));
});

// Task 12: Get books by author using async/await with Axios
public_users.get('/author/:author', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Task 13: Get books by title using async/await with Axios
public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${req.params.title}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(404).json({ message: "No books found for this title" });
  }
});

public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (book) return res.status(200).json(book.reviews);
  else return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
