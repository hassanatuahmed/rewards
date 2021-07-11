const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Table
const ReferralCodeSchema = new Schema({
  email: String,
  referralCode: String,
  isReferralApplied:Boolean,
  createdAt: { type: Date, default: Date.now }
});

ReferralCodeSchema.virtual('date')
  .get(() => this._id.getTimestamp());

mongoose.model('Referrals', ReferralCodeSchema);

