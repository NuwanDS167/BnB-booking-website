const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId },
  user: { type: mongoose.Schema.Types.ObjectId },
  amount: { type: Number},
  date: { type: Date},

});

const PaymentModel = mongoose.model('Payment', paymentSchema);

module.exports = PaymentModel;