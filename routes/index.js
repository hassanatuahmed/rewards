var express = require('express');
var router = express.Router();

const auth = require('../middleware/auth');
const referralsController = require('../controllers/referrals.controller');
const vouchersController = require('../controllers/vouchers.controller');
const authController = require('../controllers/auth.controller');


 router.post('/newReferralCode', referralsController.newReferralCode);
 router.post('/creditReferralUser',referralsController.creditReferral);
 router.post('/buyWithReferralCredits',referralsController.buyWithPlendifyCredits);
 
 router.post('/generate-voucher',vouchersController.newVoucher);
 router.post('/apply-voucher',vouchersController.applyVoucher);

 router.post('/get-token',auth.generateToken);

 

 

module.exports = router;
