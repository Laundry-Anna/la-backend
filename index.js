require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const https = require('https');
const fs = require('fs');
//const createError = require('http-errors');
// const session = require('express-session');
const app = express();

// middlewares
// const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const expressSwagger = require('express-swagger-generator')(app);
// connect to database
 
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('DB CONNECTED');
  })
  .catch(err => console.log( 'DB Connection Error', err ));
 
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
// admin routes
const authRoutes = require('./src/routes/auth');
const mothercategoryRoutes = require('./src/routes/admin/mothercategory');
const categoryRoutes = require('./src/routes/admin/category');
const subcategoryRoutes = require('./src/routes/admin/subcategory');
const serviceRoutes = require('./src/routes/admin/service');
const companyRoutes = require('./src/routes/admin/company');
const storeRoutes = require('./src/routes/admin/store');
const staffTypesRoutes = require('./src/routes/admin/stafftypes');
const itemRoutes = require('./src/routes/admin/item');
const orderRoutes = require('./src/routes/admin/order');
const pickupRoutes = require('./src/routes/pickup');
const paymentRoutes = require('./src/routes/payment');

app.use('/', authRoutes);
app.use('/admin/mc', mothercategoryRoutes);
app.use('/admin/cat', categoryRoutes);
app.use('/admin/subcat', subcategoryRoutes);
app.use('/admin/service', serviceRoutes);
app.use('/admin/company', companyRoutes);
app.use('/admin/store', storeRoutes);
app.use('/admin/stafftypes', staffTypesRoutes);
app.use('/admin/item', itemRoutes);
app.use('/admin/order', orderRoutes);
app.use('/pickup', pickupRoutes);
app.use('/payment', paymentRoutes);

// admin + api routes
const cityRoutes = require('./src/routes/city');
const staffRoutes = require('./src/routes/staff');
const customerRoutes = require('./src/routes/customer');
const rateCardRoutes = require('./src/routes/ratecard');
const membershipRoutes = require('./src/routes/membership');
const walletRoutes = require('./src/routes/wallet');
const couponRoutes = require('./src/routes/coupon');
const timeslotsRoutes = require('./src/routes/timeslot');

app.use('/admin/customer', customerRoutes);
app.use('/admin/city', cityRoutes);
app.use('/admin/staff', staffRoutes);
app.use('/admin/ratecard', rateCardRoutes);
app.use('/membership', membershipRoutes);
app.use('/wallet', walletRoutes);
app.use('/admin/coupon', couponRoutes);
app.use('/admin/timeslot', timeslotsRoutes);

// api Routes

// if not routes found show error
app.use((req, res, next) => {
  let path = req.path.split('/')[1];
  const skipPaths = 'api-docs';
  if(req.path.indexOf(skipPaths) == -1) {
    const error = new Error('Request not found');
    error.status = 404;
    next(error);
  } else {
    next();
  }
  
});
// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  return res.status(err.status).json({
    error: true,
    message: 'Request not found',
  });
});
/*
var key = fs.readFileSync(__dirname + '/ssl/node-selfsigned.key');
var cert = fs.readFileSync(__dirname + '/ssl/node-selfsigned.crt');
var options = {
  key: key,
  cert: cert
};
*/
// Port
const port = process.env.PORT || 1338;
// starting server
//var server = https.createServer(options, app);

expressSwagger(config.swagger);

app.listen(port, () => {
  console.log(`Listening to port http://localhost:${port}`);
});
