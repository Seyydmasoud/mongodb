const express = require("express");
const router = express.Router();
const { getDatabase } = require("../db");
const { ObjectId } = require("mongodb");

// Validation middleware for post data
function validatePostData(req, res, next) {
  const { title, content, category } = req.body;
  if (!title || !content || !category) {
    return res
      .status(400)
      .json({ message: "Title, content, and category are required" });
  }
  next();
}

// GET all posts
router.get("/", async (req, res) => {
  try {
    const db = getDatabase();
    const postsCollection = db.collection("posts");
    const posts = await postsCollection.find().toArray();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET single post by ID
router.get("/:id", async (req, res) => {
  try {
    const db = getDatabase();
    const postsCollection = db.collection("posts");
    const postId = req.params.id;
    const post = await postsCollection.findOne({ _id: ObjectId(postId) });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Create a new post
router.post("/", validatePostData, async (req, res) => {
  try {
    const db = getDatabase();
    const postsCollection = db.collection("posts");
    const { title, content, category } = req.body;
    const newPost = { title, content, category };
    const result = await postsCollection.insertOne(newPost);
    res.status(201).json(result.ops[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update a post by ID
router.put("/:id", validatePostData, async (req, res) => {
  try {
    const db = getDatabase();
    const postsCollection = db.collection("posts");
    const postId = req.params.id;
    const { title, content, category } = req.body;
    const updatedPost = { title, content, category };
    const result = await postsCollection.updateOne(
      { _id: ObjectId(postId) },
      { $set: updatedPost }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete a post by ID
router.delete("/:id", async (req, res) => {
  try {
    const db = getDatabase();
    const postsCollection = db.collection("posts");
    const postId = req.params.id;
    const result = await postsCollection.deleteOne({ _id: ObjectId(postId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;