const customer = require('../models/customer');
const walletlog = require('../models/walletlog');
const Wallet = require('../models/wallet');
const membership = require('../models/membership');
const commonValidation = require('../middlewares/commonvalidation');
const validate = require('../middlewares/validate');
const Utils = require('../utils/app.utils');
const PaymentController = require('./payment');

exports.updateWallet = async (req, res) => {
  try {
    if (
      typeof req.query.customerId === 'undefined' &&
      req.query.customerId === ''
    ) {
      return res.status(500).json({
        error: true,
        message: 'Please enter a valid customerId',
      });
    }
    const validateObjectId = await commonValidation.isObjectId(
      req.query.customerId
    );
    if (!validateObjectId) {
      return res.status(500).json({
        error: true,
        message: 'Please enter a valid input - customerId',
      });
    }

    // check if customer exists or not
    let customerData = await customer.findById(req.query.customerId);
    if (!customerData) {
      return res.status(400).json({
        error: true,
        message: 'Customer not exist',
      });
    }

    const { addWalletType } = req.body;
    let transactionType = 'CREDIT';
    let transactionName = '';
    let amountToCredit = 0;
    if (addWalletType === 'membership') {
      if (
        typeof req.body.membershipId === 'undefined' &&
        req.body.membershipId === ''
      ) {
        return res.status(500).json({
          error: true,
          message: 'Please select membership to add wallet',
        });
      }
      // get membership data from mebership id
      let membershipData = await membership.findById(req.body.membershipId);
      if (!membershipData) {
        return res.status(400).json({
          error: true,
          message: 'Membership plan not exists. Please select another plan',
        });
      } else {
        amountToCredit = membershipData.planCreditAmount;
        transactionName = 'membership';
        membershipPlanAmount = membershipData.planAmount;
      }
    } else if (addWalletType === 'wallet') {
      // if addWalletType ==  money
      amountToCredit = req.body.amount;
      transactionName = 'cash';
    } else {
      return res.status(500).json({
        error: true,
        message: 'Please enter a valid wallet type',
      });
    }
    if (amountToCredit <= 0) {
      return res.status(500).json({
        error: true,
        message: 'Please enter a valid amount to add',
      });
    }
    // update wallet + or - in customer table
    let cashWallet = customerData.cashWallet;
    let newCashWallet = parseInt(cashWallet) + parseInt(amountToCredit);
    // update cashwallet in customer table
    let updateData = { cashWallet: newCashWallet };
    let updateCustomerWallet = await customer.findByIdAndUpdate(
      { _id: req.query.customerId },
      { $set: updateData },
      { new: true, useFindAndModify: false }
    );
    if (updateCustomerWallet) {
      // insert wallet log table
      const newWalletLog = new walletlog({
        customerId: req.query.customerId,
        amount: amountToCredit,
        //beforeTransactionCashWallet: cashWallet,
        //afterTransactionCashWallet: newCashWallet,
        transactionType: transactionType,
        type: transactionName.toUpperCase(),
        walletType: 'cashWallet',
        createdBy: req.user._id,
        createdType: req.user.userType, // staff, customer
        updatedBy: req.user._id,
        updatedType: req.user.userType, // staff, customer
      });
      if (
        typeof req.body.membershipId !== 'undefined' &&
        req.body.membershipId !== ''
      ) {
        newWalletLog.detail.membershipId = req.body.membershipId;
        //newWalletLog.membershipPlanAmount = membershipPlanAmount;
      }
      if (
        typeof req.body.walletDescription !== 'undefined' &&
        req.body.walletDescription !== ''
      ) {
        newWalletLog.description = req.body.walletDescription;
      }
      if (
        typeof req.body.paymentTransaction !== 'undefined' &&
        req.body.paymentTransaction !== ''
      ) {
        newWalletLog.paymentTransaction = req.body.paymentTransaction;
      }
      if (
        typeof req.body.paymentReferenceId !== 'undefined' &&
        req.body.paymentReferenceId !== ''
      ) {
        newWalletLog.paymentReferenceId = req.body.paymentReferenceId;
      }
      console.log('wallet', newWalletLog)
      let insertWalletLog = await newWalletLog.save();
      if (!insertWalletLog) {
        return res.status(400).json({
          error: true,
          message: 'Something went wrong. Please try again - add rate card',
        });
      }
      let walletExist = await Wallet.find({customerId:req.query.customerId});
      let balance = amountToCredit;
      console.log('walletExist', walletExist)
      if(walletExist!= null && walletExist.length) {
        balance += amountToCredit;
      } 
      let expiry = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
      let walletObj = {
        customerId: req.query.customerId,
        walletLogId: insertWalletLog._id,
        balance: balance,
        type: 'CASH',
        expiry
      }
      await Wallet.updateOne({customerId:req.query.customerId }, walletObj,{upsert:true});

      let outputData = {
        cashWallet: balance
      };
      res.status(200).json({
        error: false,
        message: 'Wallet added successfully',
        data: outputData,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Customer wallet not updated. Please try again',
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
exports.getWallet = async (req, res) => {
  try {
    if (
      typeof req.query.customerId !== 'undefined' &&
      req.query.customerId !== ''
    ) {
      const validateObjectId = await commonValidation.isObjectId(
        req.query.customerId
      );
      if (!validateObjectId) {
        return res.status(500).json({
          error: true,
          message: 'Please enter a valid input - isobjectid',
        });
      }
      let walletLogData = await walletlog.find({
        customerId: req.query.customerId,
      });
      if (walletLogData) {
        return res.json({
          error: false,
          data: walletLogData,
        });
      } else {
        return res.status(400).json({
          error: true,
          message: 'Wallet logs not exists.',
        });
      }
    } else {
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.topupWallet = async (req, res) => {
  
  try {
    const { addWalletType } = req.body;
    let amountToCredit = 0;
    let validCustomer = await validate.validateCustomerId(req.query.customerId);
    if(validCustomer.error) {
      return Utils.sendError(validCustomer.message, res);
    }
    if (addWalletType === 'membership') {
      if (typeof req.body.membershipId === 'undefined' && req.body.membershipId === '') {
        return res.status(500).json({
          error: true,
          message: 'Please select membership to add wallet',
        });
      }
      // get membership data from mebership id
      let membershipData = await membership.findById(req.body.membershipId);
      if (!membershipData) {
        return res.status(400).json({
          error: true,
          message: 'Membership plan not exists. Please select another plan',
        });
      } else {
        //amountToCredit = membershipData.planCreditAmount;
        //transactionName = 'membership';
        membershipPlanAmount = membershipData.planAmount;
      }
    } else if (addWalletType === 'wallet') {
      //amountToCredit = req.body.amount;
      //transactionName = 'wallet';
    } else {
      return res.status(500).json({
        error: true,
        message: 'Please enter a valid wallet type',
      });
    }

    let paymentObj = {
      customerId: req.query.customerId,
      type: 'WALLET_TOPUP',
      amount: req.body.membershipId ? membershipPlanAmount: req.body.amount
    }
    if(req.body.membershipId) {
      paymentObj['membershipId'] = req.body.membershipId;
    }
    req.body = paymentObj;
    return PaymentController.generatePaymentLink(req, res);
    //const { addWalletType } = req.body;
    let transactionType = 'credit';
    let transactionName = '';
    //let amountToCredit = 0;
    let membershipPlanAmount = 0;
    
    if (amountToCredit <= 0) {
      return res.status(500).json({
        error: true,
        message: 'Please enter a valid amount to add',
      });
    }
    // update wallet + or - in customer table
    let cashWallet = customerData.cashWallet;
    let newCashWallet = parseInt(cashWallet) + parseInt(amountToCredit);
    // update cashwallet in customer table
    let updateData = { cashWallet: newCashWallet };
    let updateCustomerWallet = await customer.findByIdAndUpdate(
      { _id: req.query.customerId },
      { $set: updateData },
      { new: true, useFindAndModify: false }
    );
    if (updateCustomerWallet) {
      // insert wallet log table
      const newWalletLog = new walletlog({
        customerId: req.query.customerId,
        amount: amountToCredit,
        beforeTransactionCashWallet: cashWallet,
        afterTransactionCashWallet: newCashWallet,
        transactionType: transactionType,
        transactionName: transactionName,
        walletType: 'cashWallet',
        createdBy: req.user._id,
        createdType: req.user.userType, // staff, customer
        updatedBy: req.user._id,
        updatedType: req.user.userType, // staff, customer
      });
      if (
        typeof req.body.membershipId !== 'undefined' &&
        req.body.membershipId !== ''
      ) {
        newWalletLog.membershipId = req.body.membershipId;
        newWalletLog.membershipPlanAmount = membershipPlanAmount;
      }
      if (
        typeof req.body.walletDescription !== 'undefined' &&
        req.body.walletDescription !== ''
      ) {
        newWalletLog.walletDescription = req.body.walletDescription;
      }
      if (
        typeof req.body.paymentTransaction !== 'undefined' &&
        req.body.paymentTransaction !== ''
      ) {
        newWalletLog.paymentTransaction = req.body.paymentTransaction;
      }
      if (
        typeof req.body.paymentReferenceId !== 'undefined' &&
        req.body.paymentReferenceId !== ''
      ) {
        newWalletLog.paymentReferenceId = req.body.paymentReferenceId;
      }
      let insertWalletLog = await newWalletLog.save();
      if (!insertWalletLog) {
        return res.status(400).json({
          error: true,
          message: 'Something went wrong. Please try again - add rate card',
        });
      }
      let outputData = {
        cashWallet: updateCustomerWallet.cashWallet,
      };
      res.status(200).json({
        error: false,
        message: 'Wallet added successfully',
        data: outputData,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Customer wallet not updated. Please try again',
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};