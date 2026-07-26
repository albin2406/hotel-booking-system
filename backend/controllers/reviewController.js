import Review from "../models/Review.js";

export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Rating and comment are required!",
      });
    }

    const existingReview = await Review.findOne({ user: req.user.id });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a review",
      });
    }

    const review = await Review.create({
      user: req.user.id,
      rating,
      comment,
    });

    const populatedReview = await review.populate("user", "name");

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: populatedReview,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error!",
    });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error!",
    });
  }
};