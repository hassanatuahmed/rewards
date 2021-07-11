require("dotenv").config();
const mongoose = require("mongoose");
const voucher_codes = require('voucher-code-generator');
const _ = require("lodash");
const { pull, orderBy } = require("lodash");

const Vouchers = mongoose.model("Vouchers");
const ApplyVoucher = mongoose.model("ApplyVoucher");

const Controller = {};
module.exports = Controller;


Controller.newVoucher =(req,res)=>{
    const saveVoucher = new Vouchers({
        amount:req.body.amount, //if percentage, field will contain percent value
        valueType:req.body.valueType,  //fixed, percentage
        category:req.body.category, //Product Category
        voucherType:req.body.voucherType, //orders, plans or promotions
        frequency:req.body.frequency, //No. of times voucher can be used
        expiryDate:req.body.expiryDate, //voucher expiry date
        appliesTo: ["delivery","product"], //Voucher can apply to delivery and product
        userTag:req.body.userTag || "" //type of users that can use this voucher leave empty for all types e.g. 
    });
    var str = req.body.voucherType.slice(0,2);
    const voucher=  voucher_codes.generate({
        // prefix: req.body.voucherType,
        prefix:str.toUpperCase(),
        length:3,
        charset: voucher_codes.charset("alphabetic")
    });
    saveVoucher.voucherCode  = voucher[0];
    saveVoucher.save();
    res.json({status:"00",message:`Voucher created successfully. Code :${voucher[0]}`,data:voucher[0]});
}


Controller.applyVoucher = (req,res)=>{
    const applyingVoucher = new ApplyVoucher({
        voucherCode:req.body.voucherCode,
        email:req.body.email,
        type:req.body.type,
        deliveryFee:req.body.deliveryFee,
        amount:req.body.amount,
        category:req.body.category,
    });

    const response = {
        status: "00",
        message: "sucessfully saved"
    };

    applyingVoucher.save();
    res.json(response);
}
