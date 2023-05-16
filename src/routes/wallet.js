const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/auth');
const { getWallet, updateWallet, topupWallet } = require('../controllers/wallet');
const { verify } = require('jsonwebtoken');

router.get('/', verifyToken, getWallet);

router.put('/', verifyToken, updateWallet);

router.post('/topup', verifyToken, topupWallet);

router.get('/balance', verifyToken, updateWallet);

module.exports = router;
