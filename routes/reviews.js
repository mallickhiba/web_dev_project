const express = require('express');
const router = express.Router();
const Task = require("../models/Bookings");
const Review = require("../models/Reviews");

// GET all reviews
router.get('/reviews', async (req, res) => {
  try {
    console.log("getting all the reviews")
    const reviews = await Review.find();
    res.json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// GET a specific review by ID
router.get('/reviews/:id', async (req, res) => {
  try {
    console.log("getting review with id " + req.params.id)
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }
    res.json({ review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// POST a new review
router.post('/reviews/create', async (req, res) => {
  try {
    console.log("creating new review")
    const newReview = new Review(req.body);
    const savedReview = await newReview.save();
    res.status(201).json({ msg: "Review created", review: savedReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// PUT/UPDATE an existing review
router.put('/reviews/update/:id', async (req, res) => {
  try {
    console.log("editing review with id "+ req.params.id)
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }
    res.json({ msg: "Review updated", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// DELETE a review
router.delete('/reviews/delete/:id', async (req, res) => {
  try {
    console.log("deleting review with id" + req.params.id)
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }
    res.json({ msg: "Review deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});