const coupon = require('../models/coupon');
const couponMiddleware = require('../middlewares/coupon');
const storeController = require('../controllers/admin/store');
const motherCategory = require('../models/mothercategory');

exports.insertCoupon = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Not authorized to access !',
      });
    }
    let couponData = await coupon.findOne({
      $and: [
        {
          companyId: req.user.companyId,
        },
        {
          couponName: req.body.couponName.toUpperCase(),
        },
      ],
    });
    if (couponData) {
      return res.status(401).json({
        error: true,
        message: 'Same coupon name already exists',
      });
    }
    // check same coupon name exists on company level
    const insertValidateData = await couponMiddleware.couponValidation(
      req.body,
      req.user
    );
    if (Object.keys(insertValidateData).length > 0) {
      return res.status(401).json({
        error: insertValidateData.error,
        message: insertValidateData.message,
      });
    }
    // insert into coupon table
    const newCoupon = new coupon({
      companyId: req.user.companyId,
      pickupTime: req.body.pickupTime,
      bookingTime: req.body.bookingTime,
      geoArea: req.body.geoArea,
      category: req.body.category,
      orderMode: req.body.orderMode,
      serviceType: req.body.serviceType,
      couponName: req.body.couponName.toUpperCase(),
      customerLvl: req.body.customerLvl,
      couponMeta: req.body.couponMeta,
      couponScheme: req.body.couponScheme,
      applicableClient: req.body.applicableClient,
      createdBy: req.user._id,
      createdType: req.userType, // staff, customer
      registeredFrom: req.clientType, // admin, ios, android, msite, website
    });
    let insertCoupon = await newCoupon.save();
    if (insertCoupon) {
      res.status(200).json({
        error: false,
        message: 'Coupon added successfully',
        data: {
          _id: insertCoupon._id,
        },
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Something went wrong. Please try again - coupon',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.getCoupon = async (req, res) => {
  try {
    if (
      typeof req.query.couponName !== 'undefined' &&
      req.query.couponName !== ''
    ) {
      let couponData = await coupon.find({
        $and: [
          {
            companyId: req.user.companyId,
          },
          {
            couponName: { $regex: req.query.couponName, $options: 'i' },
          },
        ],
      });
      if (couponData) {
        return res.json({
          error: null,
          data: couponData,
        });
      } else {
        return res.status(400).json({
          error: true,
          message: 'Coupons not exist',
        });
      }
    } else if (typeof req.query.id !== 'undefined' && req.query.id !== '') {
      let couponData = await coupon.findById(req.query.id);
      if (couponData) {
        return res.json({
          error: null,
          data: couponData,
        });
      } else {
        return res.status(400).json({
          error: true,
          message: 'Coupon not exist',
        });
      }
    } else {
      let couponData = await coupon.find({ companyId: req.user.companyId });
      if (couponData) {
        return res.json({
          error: null,
          data: couponData,
        });
      } else {
        return res.status(400).json({
          error: true,
          message: 'Coupons not exist',
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Not authorized to access !',
      });
    }
    if (
      typeof req.body.couponName !== 'undefined' &&
      req.body.couponName !== ''
    ) {
      req.body.couponName = req.body.couponName.toUpperCase();
    }
    let couponData = await coupon.findOne({
      $and: [
        {
          companyId: req.user.companyId,
        },
        {
          couponName: req.body.couponName.toUpperCase(),
        },
        {
          _id: { $ne: req.query.id },
        },
      ],
    });
    if (couponData) {
      return res.status(401).json({
        error: true,
        message: 'Same coupon name already exists',
      });
    }
    // check same coupon name exists on company level
    const insertValidateData = await coupon.couponValidation(
      req.body,
      req.user
    );
    if (Object.keys(insertValidateData).length > 0) {
      return res.status(401).json({
        error: insertValidateData.error,
        message: insertValidateData.message,
      });
    }
    req.body.updatedBy = req.user._id;
    req.body.updatedType = req.userType; // staff, customer
    let updateCoupon = await coupon.findByIdAndUpdate(
      { _id: req.query.id },
      { $set: req.body },
      { new: true, useFindAndModify: false }
    );
    if (updateCoupon) {
      res.status(200).json({
        error: null,
        message: 'Coupon updated successfully',
        data: updateCoupon,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Coupon not updated. Please try again',
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};


exports.applyCoupon = async (req, res) => {
  let orderData = JSON.parse(JSON.stringify(req.body))
  if (!req.user) {
    return res.status(401).json({
      error: true,
      message: 'Not authorized to access !',
    });
  }
  //check if the coupon exist for the company
  let couponData = await coupon.findOne({
    $and: [
      { companyId: req.user.companyId },
      { couponName: req.body.couponCode.toUpperCase() }
    ],
  });
  if (!couponData) {
    return res.status(401).json({
      error: true,
      message: 'Invalid Coupon Code',
    });
  }

  let mode = 'online'; //TODO

  //Check if the maximum usage limit is exceeded
  const couponScheme = couponData.couponScheme;
  let applicableOrders = orderData.orderCategories;
  console.log('couponScheme', couponScheme)
  if(couponScheme.overallUsageCount && couponScheme.overallUsageCount > couponData.usageCount+1) { 
    return res.status(401).json({
      error: true,
      message: 'The maximum usage limit for this coupon has exceeded',
    });
  }

  //Check if the maximum usage limit per is exceeded
  if(couponScheme.maxCountPerUser && couponScheme.maxCountPerUser > 2) { //TODO
    return res.status(401).json({
      error: true,
      message: 'The maximum usage limit for this coupon for a single user has exceeded',
    });
  }

  //Check if the coupon applicable for the category
  if(couponData.category && couponData.category.selected) {

    let orderCategories = req.body.orderCategories;
    let couponApplicable = false;
    applicableOrders = [];
   
      for(let i=0;i<orderCategories.length; i++) {
        let c = orderCategories[i];
        if(couponData.category.selectionArray.indexOf(c.categoryId) !== -1) {
          couponApplicable = true;
          applicableOrders.push(c);
          
        }
      }

      if(applicableOrders.length == 0) {
        return res.status(401).json({
          error: true,
          message: 'The coupon is not applicable for the  category you have selected',
        });
      }
  }


  //Check if the coupon applicable for the store
  if(couponData.geoArea && couponData.geoArea.selected && couponData.geoArea.couponCheck.indexOf(req.body.storeId) ==-1) {
    return res.status(401).json({
      error: true,
      message: 'The coupon is not applicable for the store you have selected',
    });
  }

  //Check if the  minimum order value criteria is met
  if(couponScheme.minOrderValue && couponScheme.minOrderValue.selected && parseFloat(couponScheme.minOrderValue.value) > parseFloat(req.body.orderTotal)) { //TODO
    return res.status(401).json({
      error: true,
      message: 'The coupon is applicable only for minimum order value of '+couponScheme.minOrderValue.value,
    });
  }
  //Check if coupon applicable for booking time
  if(couponData.bookingTime && couponData.bookingTime.selected) {
   
    var from = new Date(couponData.bookingTime.fromDate);
    var to   = new Date(couponData.bookingTime.toDate);
    var bookingTime = new Date();  
    console.log(couponData.bookingTime.fromDate, from,to,bookingTime)
    if(bookingTime < from || bookingTime > to) {
      return res.status(401).json({
        error: true,
        message: 'The coupon is applicable only for bookings between '+from+ ' and '+ to,
      });
    }
  }
  
  //check if coupon applicable for the order mode
  if(couponData.orderMode && couponData.orderMode.selected) {
    if(couponData.orderMode.value.indexOf(mode) == -1){
      return res.status(401).json({
        error: true,
        message: 'The coupon is applicable only '+couponData.orderMode.value.join(',')+ ' orders '
      })
    }
  }

  //Check if the coupon applicable for selected timeSlotId
  /*
  if(couponScheme.pickupTime && couponScheme.pickupTime.selected && parseFloat(couponScheme.minOrderValue.value) > parseFloat(req.body.timeSlotId)) { 
    return res.status(401).json({
      error: true,
      message: 'The coupon is applicable only for minimum order value of '+couponScheme.minOrderValue.value,
    });
  }
  */
  //express delivery
  orderData.mcExpressMultiplier = 1;
  if(orderData.express) {
    let  cat = await motherCategory.findById(orderData.mcId).exec();
    orderData.mcExpressMultiplier = cat.mcExpressMultiplier;
  }

  //Apply coupon
  let totalDiscount = 0;
  switch(couponScheme.discountType){
    case 'amount': {
      applicableOrders.map(o => {
        let discount = (o.revisedSubOrderTotal * couponScheme.discountAmount)/orderData.orderTotal.toFixed(1)
        o.revisedSubOrderTotal = o.revisedSubOrderTotal-discount.toFixed(1);
        totalDiscount += discount;
        return o;
      })
      orderData.orderCategories = applicableOrders;
      console.log('orderData.revisedOrderTotal', orderData.revisedOrderTotal, totalDiscount)
      orderData.revisedOrderTotal = orderData.revisedOrderTotal - totalDiscount;
      break;

    }
    case 'percentage': {
      applicableOrders.map(o => {
        let discount = ((o.revisedSubOrderTotal * couponScheme.discountAmount)/100).toFixed(1)
        o.revisedSubOrderTotal = (o.revisedSubOrderTotal-discount).toFixed(1);;
        totalDiscount += discount;
        return o;
      })
      orderData.revisedOrderTotal = orderData.revisedOrderTotal - totalDiscount;
      break;
    }

    case 'deliverywaiveoff': {
      orderData.deliveryCharge = 0;
    }

    case 'expresschargewaiveoff': {
      orderData.mcExpressMultiplier = 1;
      applicableOrders.map(o => {
        let discount = o.revisedSubOrderTotal - (o.revisedSubOrderTotal * orderData.mcExpressMultiplier).toFixed(1);
        o.revisedSubOrderTotal = o.revisedSubOrderTotal-discount.toFixed(1);;
        totalDiscount += discount;
        return o;
      })
      orderData.revisedOrderTotal = orderData.revisedOrderTotal - totalDiscount;
      break;
    }

    case 'cashback': {
      orderData.cashback = couponScheme.discountAmount;
    }
    
  }
  orderData.discount = totalDiscount;

  res.status(200).json({
    error: null,
    message: 'Coupon applied successfully',
    data: orderData,
  });


}