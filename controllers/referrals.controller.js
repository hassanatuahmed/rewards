require("dotenv").config();
const mongoose = require("mongoose");
const _ = require("lodash");
const { pull } = require("lodash");

const Referrals = mongoose.model("Referrals");
const ReferralCredits = mongoose.model("ReferralCredits");
const PlendifyRewardMapping = mongoose.model("RewardMapping");
const Controller = {};
module.exports = Controller;

Controller.newReferralCode = async (req, res) => {
  const saveReferralCode = new Referrals({
    email: req.body.email,
    referralCode: req.body.referralCode,
    isReferralApplied: true
  });
  const checkingReferral = await Referrals.findOne({email:req.body.email,referralCode:req.body.referralCode});
  if(checkingReferral.email)
    return res.json({status:"01",message:`you hvae already use this Code :${checkingReferral.referralCode}`});
  saveReferralCode.save();
  res.json({ status: "00", message: "Data successfully saved" });
};

Controller.creditReferral = async (req, res) => {
  const plendifyRewardValue = await PlendifyRewardMapping.findOne({currency: req.body.currency || 'GHS'}).exec();
  const referralUser = await Referrals.findOne({ referralCode: req.body.referralCode }).exec();

  if(!referralUser)
    return res.json({status:"01",message:"wrong referral code"});

  
 
  const saveCreditReferral = new ReferralCredits({
    email: referralUser.email,
    referralCode: req.body.referralCode,
    amount: Number(req.body.credits) * plendifyRewardValue.currencyValue,
    debitCredit: "CR",
    currency: req.body.currency || "GHS",
  });

  

  saveCreditReferral.save();
  
  res.json({ status: "00", message: "Plendify credits credited to " + referralUser.email });
};

Controller.buyWithPlendifyCredits = async (req,res)=>{
  const availableCreditValue = await getplendifyCreditvalue(req.body.referralCode, req.body.currency || 'GHS');
  
  
  let paymentAmount = Number(req.body.purchaseAmount) -  availableCreditValue ;
  if(paymentAmount < 0){
    paymentAmount = 0;
  } 

  let usedPlendifyCredits = Number(req.body.purchaseAmount) - paymentAmount;
  debitCredit(usedPlendifyCredits,req.body);
  if (req.body.referralCode!== Referrals.referralCode)
    return res.json({status:"01",message:"incorrect referralCode"+" payment Amount="+paymentAmount});


  const response = {
    availableCredits : availableCreditValue,
    paymentAmount : paymentAmount,
    creditsUsed : usedPlendifyCredits,
  };

  res.json({
    status: "00",
    message: "Payment with credit successful",
    data: response  
  });
};

/*
Get total plendify credits amount in money value
*/
async function getplendifyCreditvalue(referralCode, currency) {
  const referralCredits = await ReferralCredits.find({referralCode: referralCode, currency: currency}).exec();

  const amount = referralCredits.reduce((total, r) => (total + ( r.amount)), 0);
  return amount;
};

/***
 *
 * Debit user with number of specified plendify credits
 * make the amount field negetive when debiting
 */
 async function debitCredit(amount, requestData) {
  const referralUser = await Referrals.findOne({referralCode: requestData.referralCode});
  
 

  const debitedCredit = new ReferralCredits({
    email: referralUser.email,
    referralCode: requestData.referralCode,
    amount: -1*(amount),
    debitCredit: "DB",
    currency: requestData.currency || "GHS",
  });
  debitedCredit.save();

   
};
