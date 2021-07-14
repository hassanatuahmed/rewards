const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoucherSchema= new Schema({
    amount:Number,
    valueType:String,
    voucherType:String,
    category:Number,
    voucherCode:String,
    frequency:Number,  //No of times voucher can be used
    expiryDate:Date,
    appliesTo: {type: Array,default:[]}, //Voucher can apply to delivery and product
    createdAt: { type: Date, default: Date.now } 
});

VoucherSchema.virtual('date')
.get(() => this._id.getTimestamp());

mongoose.model('Vouchers',VoucherSchema);




