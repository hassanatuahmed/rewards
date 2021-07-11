const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Table
const RewardMappingSchema = new Schema({
  creditValue: Number,
  currencyValue: Number, //equivalent amount in currency
  currency: String, //GHS , USD
 });

 RewardMappingSchema.virtual('date')
  .get(() => this._id.getTimestamp());

mongoose.model('RewardMapping', RewardMappingSchema);

