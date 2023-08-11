const mongoose = require('mongoose');
const placeSchema = require('./placeSchema');

const PlaceModel = mongoose.model('Place', placeSchema);

module.exports = PlaceModel;