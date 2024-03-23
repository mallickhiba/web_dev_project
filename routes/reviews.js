const express = require('express');
const router = express.Router();
const Review = require("../models/Reviews");
const Service = require('../models/Services'); 

const authenticate = require('../middlewares/authenticate.js');
const adminMiddleware = require('../middlewares/adminMiddleware');
const customerMiddleware = require('../middlewares/customerMiddleware');
const vendorMiddleware = require('../middlewares/vendorMiddleware');


// View all reviews -- TESTED
router.get('/viewReviews', async (req, res) => {
  try {
      const reviews = await Review.find().populate('user', 'firstName lastName').populate('service', 'service_name');
      res.json({ reviews });
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal server error" });
  }
});

// Place middleware here to ensure only customer can place review
router.use(customerMiddleware);

// Post a new review -- TESTED
router.post('/add', async (req, res) => {
  try {
      console.log("creating new review")
      const userId = req.user.id;
      const { service, rating, review } = req.body;
      const newReview = new Review({ user: userId, service, rating, review });
      const savedReview = await newReview.save();

      // Recalculate avg rating for the service and update it in the service doc
      const serviceReviews = await Review.find({ service });
      const totalRatings = serviceReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRatings / serviceReviews.length;
      await Service.findByIdAndUpdate(service, { average_rating: averageRating });

      console.log("Review added and updated");
      res.status(201).json({ msg: "Review created", review: savedReview });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal server error" });
  }
});

//Place middleware here to ensure only customer or admin can view customer's review and delete them.  
router.use(adminMiddleware);
router.use(customerMiddleware);

// Get a specific review by id. (useful for admin implementation) -- TESTED
router.get('/review/:id', async (req, res) => {
  try {
      console.log("getting your desired review ")
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

// Get all reviews of a specific customer. -- TESTED
router.get('/getbyCustomer', async (req, res) => {
    try {
      console.log("Request received to get reviews by customer");
  
      let userId;
      if (req.user.role == "admin") {
        console.log("User is an admin. Extracting userId from request body.");
        userId = req.body.customerId; // Extract userId from request body for admin
      } else {
        console.log("User is not an admin. Extracting userId from authenticated user.");
        userId = req.user.id; // Extract userId from authenticated user for non-admin users
      }
  
      console.log("Retrieving reviews for userId:", userId);
      const reviews = await Review.find({ user: userId }).populate({
        path: 'service',
        select: 'service_type service_name -_id'
      });
  
      if (!reviews || reviews.length === 0) {
        console.log("No reviews found for userId:", userId);
        return res.status(404).json({ msg: "No reviews found for this user" });
      }
  
      console.log("Reviews found for userId:", userId);
      res.json({ reviews });
    } catch (error) {
      console.error("Error in /getbyCustomer route:", error);
      res.status(500).json({ msg: "Internal server error" });
    }
  });
  

// Delete any review -- TESTED
router.post('/delete/:id', async (req, res) => {
    try {
      const reviewId = req.params.id;
  
      console.log("Received request to delete review with ID:", reviewId);
  
      // Retrieve the review to be deleted
      const reviewToDelete = await Review.findById(reviewId);
      if (!reviewToDelete) {
        console.log("Review not found");
        return res.status(404).json({ msg: "Review not found" });
      }
  
      // Check if user is admin then delete the review directly.
      if (req.user.role == "admin") {
        console.log("Admin user requested to delete review directly");
        await Review.findByIdAndDelete(reviewId);
      } else {
        // Customer is logged in so check if the review belongs to the logged-in user
        const userId = req.user.id;
        console.log("Regular user requested to delete review, user ID:", userId);
  
        if (String(reviewToDelete.user) !== String(userId)) {
          console.log("User not authorized to delete this review");
          return res.status(403).json({ msg: "You are not authorized to delete this review" });
        }
  
        console.log("Deleting review");
        await Review.findByIdAndDelete(reviewId);
      }
  
      // Recalculate avg rating for the service and update it in the service doc
      console.log("Calculating new average rating for the service");
      const remainingReviews = await Review.find({ service: reviewToDelete.service });
      const totalRatings = remainingReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRatings / remainingReviews.length;
      await Service.findByIdAndUpdate(reviewToDelete.service, { average_rating: averageRating });
  
      console.log("Review deleted successfully");
      res.json({ msg: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ msg: "Internal server error" });
    }
  });

module.exports = router;
