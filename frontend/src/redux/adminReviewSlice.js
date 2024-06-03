import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    reviews: [],
};

const adminReviewSlice = createSlice({
    name: "adminReviews",
    initialState,
    reducers: {
        setReviews(state, action) {
            state.reviews = action.payload;
        },
        editReviews(state, action) {
            const updatedReview = action.payload;
            state.reviews = state.reviews.map((review) =>
                review._id === updatedReview._id ? updatedReview : review
            );
        },
        deleteReview(state, action) {
            const idToDelete = action.payload;
            state.reviews = state.reviews.filter((review) => review._id !== idToDelete);
        },
    },
});

export const { setReviews, editReview, deleteReview } = adminReviewSlice.actions;

export default adminReviewSlice.reducer;
