const express = require("express");
const Todo = require("../models/Todo");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Create Todo
router.post("/", auth, async (req, res) => {
  try {
    console.log("req",req.body);
    const todo = new Todo({
      title: req.body.title,
      userId: req.user.id
    });

    await todo.save();
    res.json(todo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Todos
router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/test", auth, async (req, res) => {
  try {
    const todos = {message:'hey...this is todo - backend'};
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update Todo 
router.put("/:id", auth, async (req, res) => {
  try {
    console.log("req",req);
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Todo
router.delete("/:id", auth, async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
