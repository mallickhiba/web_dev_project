const express = require('express');
const router = express.Router();
const Review = require("../models/Reviews");
const Service = require('../models/Services');
const User = require('../models/User'); 
const authenticate = require('../middlewares/authenticate.js');
const adminMiddleware = require('../middlewares/adminMiddleware');
const customerMiddleware = require('../middlewares/customerMiddleware');
const vendorMiddleware = require('../middlewares/vendorMiddleware');

// Fetch reviews based on service ID
router.get('/getreviews/:serviceId', async (req, res) => {
  const { serviceId } = req.params;

  try {
    const reviews = await Review.find({ service: serviceId }).populate('user', 'firstName lastName');
    res.json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});
// View all reviews
router.get('/view-reviews', async (req, res) => {
  try {
    const reviews = await Review.find().populate('user', 'firstName lastName').populate('service', 'service_name');
    res.json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Post a new review
router.post('/add', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { service, rating, review } = req.body;
    const newReview = new Review({ user: userId, service, rating, review });
    const savedReview = await newReview.save();

    // Recalculate avg rating for the service and update it in the service doc
    const serviceReviews = await Review.find({ service });
    const totalRatings = serviceReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRatings / serviceReviews.length).toFixed(1);
    await Service.findByIdAndUpdate(service, { average_rating: Number(averageRating) });

    // Fetch the user's first and last names and include them in the response
    const user = await User.findById(userId, 'firstName lastName');
    const reviewData = {
      _id: savedReview._id,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      service: savedReview.service,
      rating: savedReview.rating,
      review: savedReview.review,
      __v: savedReview.__v,
    };

    res.status(201).json({ msg: "Review created", review: reviewData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});


// Get a specific review by id (useful for admin implementation)
router.get('/review/:id', authenticate, async (req, res) => {
  try {
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

// Get all reviews of a specific customer
router.get('/getbyCustomer', authenticate, async (req, res) => {
  try {
    let userId = req.user.id;
    if (req.user.role === "admin") {
      userId = req.body.customerId; // Extract userId from request body for admin
    }

    const reviews = await Review.find({ user: userId }).populate({
      path: 'service',
      select: 'service_type service_name -_id'
    });

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ msg: "No reviews found for this user" });
    }

    res.json({ reviews });
  } catch (error) {
    console.error("Error in /getbyCustomer route:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Delete any review
router.post('/delete/:id', authenticate, async (req, res) => {
  try {
    const reviewId = req.params.id;

    // Retrieve the review to be deleted
    const reviewToDelete = await Review.findById(reviewId);
    if (!reviewToDelete) {
      return res.status(404).json({ msg: "Review not found" });
    }

    // Check if user is admin then delete the review directly.
    if (req.user.role == "admin") {
      await Review.findByIdAndDelete(reviewId);
    } else {
      // Customer is logged in so check if the review belongs to the logged-in user
      const userId = req.user.id;
      if (String(reviewToDelete.user) !== String(userId)) {
        return res.status(403).json({ msg: "You are not authorized to delete this review" });
      }

      await Review.findByIdAndDelete(reviewId);
    }

    // Recalculate avg rating for the service and update it in the service doc
    const remainingReviews = await Review.find({ service: reviewToDelete.service });
    const totalRatings = remainingReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRatings / remainingReviews.length;
    await Service.findByIdAndUpdate(reviewToDelete.service, { average_rating: averageRating });

    res.json({ msg: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
