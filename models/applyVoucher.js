const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApplyVoucherSchema= new Schema({
    voucherCode:String,
    email:String,
    type:String,
    deliveryFee:Number,
    amount:Number,
    categories:String,
    createdAt: { type: Date, default: Date.now },
});

ApplyVoucherSchema.virtual('date')
.get(() => this._id.getTimestamp());

mongoose.model('ApplyVoucher',ApplyVoucherSchema);




