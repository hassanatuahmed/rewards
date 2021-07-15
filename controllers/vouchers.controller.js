require("dotenv").config();
const mongoose = require("mongoose");
const voucher_codes = require('voucher-code-generator');
const _ = require("lodash");
const { pull, orderBy } = require("lodash");

const Vouchers = mongoose.model("Vouchers");

const Controller = {};
module.exports = Controller;
const handleResponse = (status, message, body,res) => {
    res.json({
        status,
        message,
        data: body
    })
};


Controller.newVoucher =(req,res)=>{
    const saveVoucher = new Vouchers({
        amount:req.body.amount, //if percentage, field will contain percent value
        valueType:req.body.valueType,  //fixed, percentage
        category:req.body.category, //Product Category
        voucherType:req.body.voucherType, //orders, plans or promotions
        frequency:req.body.frequency, //No. of times voucher can be used
        expiryDate:req.body.expiryDate, //voucher expiry date
        appliesTo: req.body.appliesTo, //Voucher can apply to delivery and product
        userTag:req.body.userTag || "" //type of users that can use this voucher leave empty for all types e.g. 
    });
    var str = req.body.voucherType.slice(0,2);
    const voucher =  voucher_codes.generate({
        // prefix: req.body.voucherType,
        prefix:str.toUpperCase(),
        length:3,
        charset: voucher_codes.charset("alphabetic")
    });
    saveVoucher.voucherCode  = voucher[0];
    if (req.body.valueType === "percentage" || req.body.valueType === "fixed"){
        console.log("all good");
    }
    else{
        return handleResponse("01","wrong value type",{},res);
    }

    if (req.body.valueType === "percentage" && Number(req.body.amount) > 100) {
        return res.json({
            status: "01",
            message: "Please provide an appropriate percentage value",
        })
    }
    
    if (Boolean(Array.isArray(req.body.appliesTo))){
       if(req.body.appliesTo.length < 1)
       return handleResponse("01", "Sorry, appliesTo cannot  be empty", null,res);
    }
       
    else{
        return handleResponse("01", "Sorry, appliesTo can only be an array", null,res);
    }
    if(!req.body.voucherType)
    return handleResponse("01", "Sorry, voucherType cannot  be empty", null,res);

    if(!req.body.expiryDate)
    return handleResponse("01", "Sorry, expiryDate cannot  be empty", null,res);

    if(!req.body.frequency)
    return handleResponse("01", "Sorry, frequency cannot  be empty", null,res);

    
    

    saveVoucher.save();

    res.json({
        status:"00",
        message:`Voucher created successfully. Code :${voucher[0]}`,
        data: {
            voucher: voucher[0]
        }
    });
}


Controller.applyVoucher = async (req, res) => {
const voucher = await Vouchers.findOne({ voucherCode: req.body.voucherCode }).exec();

    /**
     * Check if voucher exists
     */
    if (!voucher) return handleResponse("01", "Sorry, Voucher does not exists", null,res);

    /**
     * Check if voucher hasn't been exhusted
     */
    if (voucher.frequency == 0) {
        return handleResponse("01", "Sorry, Voucher has been exhusted", null,res);
    };

    /**
     * Check if voucher hasn't expired yet
     */
     if (Date.now() > new Date(voucher.expiryDate).getTime()) {
        return handleResponse("01", "Sorry, Voucher has expired", null,res);
    };

    /**
     * Check if voucher is being applied to the correct entity
    */
    if (voucher.voucherType !== req.body.voucherType && req.body.voucherType !=="") 
    return handleResponse("01", "Sorry, Voucher is being applied to a wrong type", null,res);

    if (voucher.category !== req.body.category) 
    return handleResponse("01", "Sorry, Voucher is being applied to a wrong category", null,res);

    // if (voucher.appliesTo !== req.body.appliesTo)
    //  return handleResponse("01", "Sorry, Voucher is being applied to a wrong entity", null,res);
   
    let discountAmount, newAmount;

    // if (voucher.valueType === "percentage") 
    //     discountAmount = Number((voucher.amount/100) * req.body.amount);

    if (voucher.appliesTo.includes("delivery")) {
        const subTotal = Number(req.body.deliveryFee) + Number(req.body.amount);

        discountAmount = voucher.valueType === "percentage" ? Number((voucher.amount/100) * subTotal) : voucher.amount
        console.log("discount amount>>>>>>>>>>>>>>>",discountAmount)
        newAmount = subTotal - discountAmount
    }

    else {
        discountAmount = voucher.valueType === "percentage" ? Number((voucher.amount/100) * req.body.amount) : voucher.amount
        newAmount = req.body.amount - discountAmount
    }
    

    try {
        const updateResponse = await Vouchers.updateOne({ voucherCode: req.body.voucherCode }, { frequency: voucher.frequency - 1 })
    if(updateResponse){
        const response = {
                    newAmount:newAmount,
                    discountAmount: discountAmount,
                    
                };        
                handleResponse("00", "Voucher applied successfully", response,res);
       
    }
        
    } catch (error) {
        console.log(error);
        handleResponse("01","Applying voucher failed, kindly try again",{},res);
        
    }
    
    
}
