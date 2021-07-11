const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Table
const ReferralCredits = new Schema({
  email: String,

  referralCode: String,
  debitCredit: String, //DB ,CR
  amount: Number, //plendify rewards amount
  //currencyValue: Number, //equivalent amount in GHS
  currency: String, //GHS, USD
  createdAt: { type: Date, default: Date.now },
});

ReferralCredits.virtual('date')
  .get(() => this._id.getTimestamp());

mongoose.model('ReferralCredits', ReferralCredits);

