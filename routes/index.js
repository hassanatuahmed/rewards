var express = require('express');
var router = express.Router();
const referralsController = require('../controllers/referrals.controller');
const vouchersController = require('../controllers/vouchers.controller');

 router.post('/newReferralCode', referralsController.newReferralCode);
 router.post('/creditReferralUser',referralsController.creditReferral);
 router.post('/buyWithReferralCredits',referralsController.buyWithPlendifyCredits);
 
 router.post('/generate-voucher',vouchersController.newVoucher);
 router.post('/applyingvoucher',vouchersController.applyVoucher);

module.exports = router;
