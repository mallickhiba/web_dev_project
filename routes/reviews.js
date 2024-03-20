const express = require('express');
const router = express.Router();
const Review = require("../models/Reviews");



// View all reviews
router.get('/viewReviews', async (req, res) => {
  try {
      const reviews = await Review.find().populate('user', 'firstName lastName').populate('service', 'service_name');
      res.json({ reviews });
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal server error" });
  }
});



//Place middleware here to ensure only customer or admin can view customer's review and delete them.  
router.use((req, res, next) => {
  if (!req.user || (!req.user.Customer && !req.user.Admin)) {
      return res.status(403).json({ msg: "Forbidden: Access denied - Only Admin and Customer can perfrom these actions!" });
  }
  next();
});

// Get a specific review by id. (useful for admin implementation)
router.get('/:id', async (req, res) => {
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

// Get all reviews of a specific customer.
router.get('/getbyCustomer', async (req, res) => {
  try {
      let userId;

      // Check if user is admin then get reviews of specified customer id from req body
      if (req.user.Admin && req.body.customerId) {
            userId = req.body.customerId;
      } else {
          userId = req.user.userId;
      }
      const reviews = await Review.find({ user: userId }).populate({
          path: 'service',
          select: 'service_type service_name'
      });

      if (!reviews || reviews.length === 0) {
          return res.status(404).json({ msg: "No reviews found for this user" });
      }
      res.json({ reviews });
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal server error" });
  }
});


// Delete any review
router.post('/delete/:id', async (req, res) => {
  try {
      const reviewId = req.params.id;

      // Check if user is admin then delete the review directly.
      if (req.user.Admin) {
          await Review.findByIdAndDelete(reviewId);
      } else {
          // Customer is logged in so check if the review belongs to the logged-in user
          const userId = req.user.userId;
          const review = await Review.findById(reviewId);

          if (!review) {
              return res.status(404).json({ msg: "Review not found" });
          }

          if (String(review.user) !== String(userId)) {
              return res.status(403).json({ msg: "You are not authorized to delete this review" });
          }
          await Review.findByIdAndDelete(reviewId);
      }

      // Recalculate avg rating for the service and update it in the service doc
      const serviceReviews = await Review.find({ service: review.service });
      const totalRatings = serviceReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRatings / serviceReviews.length;
      await Service.findByIdAndUpdate(review.service, { average_rating: averageRating });

      res.json({ msg: "Review deleted successfully" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal server error" });
  }
});



// Place middleware here to ensure only customer can place review
router.use((req, res, next) => {
  if (!req.user || !req.user.Customer ) {
      return res.status(403).json({ msg: "Only Customer can post reviews!" });
  }
  next();
});


// Post a new review
router.post('/add', async (req, res) => {
  try {
      console.log("creating new review")
      const userId = req.user.userId;
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



module.exports = router;
