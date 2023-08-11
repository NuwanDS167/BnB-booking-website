const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Booking' },
    place: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Place' },
    user: {type: String,required: true},
    review: { type: String, required: true },
    rating: { type: Number, required: true },
  });


const ReviewModel = mongoose.model('Review', ReviewSchema);

module.exports = ReviewModel;