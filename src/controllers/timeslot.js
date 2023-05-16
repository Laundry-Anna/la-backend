const { query } = require('express');
const mongoose = require('mongoose');
const { exists } = require('../models/company');
const company = require('../models/company');
const store = require('../models/store');
const TimeSlot = require('../models/timeslot').TimeSlot;
const TempTimeSlot = require('../models/timeslot').TempTimeSlot;
const TimeSlotHelper = require('../middlewares/timeslot');
const Customer = require('../models/customer');

exports.getTimeslot = async (req, res) => {
  try {
    if (typeof req.query.storeId !== 'undefined' && req.query.storeId !== '') {
      if (
        typeof req.query.slotType !== 'undefined' &&
        req.query.slotType !== ''
      ) {
        let timeslotData = await store.find({
          _id: req.query.storeId
        });
        if (timeslotData) {
          if (req.query.slotType === 'masterSlots') {
            return res.json({
              error: null,
              data: {
                masterSlots: timeslotData[0].masterSlots
              }
            });
          } else if (req.query.slotType === 'tempSlots') {
            return res.json({
              error: null,
              data: {
                tempSlots: timeslotData[0].tempSlots
              }
            });
          } else {
            return res.json({
              error: null,
              data: {
                masterSlots: timeslotData[0].masterSlots,
                tempSlots: timeslotData[0].tempSlots
              }
            });
          }
        } else {
          return res.status(400).json({
            error: true,
            message: 'Store not exist'
          });
        }
      }
      let timeslotData = await store.find({
        _id: req.query.storeId
      });
      if (timeslotData) {
        return res.json({
          error: null,
          data: {
            masterSlots: timeslotData[0].masterSlots,
            tempSlots: timeslotData[0].tempSlots
          }
        });
      } else {
        return res.status(400).json({
          error: true,
          message: 'Store not exist'
        });
      }
    }

    let timeslotData = await company
      .findById({
        _id: req.user.companyId
      })
      .populate({
        path: 'timeSlots',
        options: {
          sort: {
            order: 1
          }
        }
      });
    if (timeslotData) {
      return res.json({
        error: null,
        data: {
          timeSlots: timeslotData.timeSlots
        }
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Company not exist'
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

exports.getAllTimeSlots = async (req, res) => {
   
    let companyId = null;
    if(req.query.customerId) {
      let customer = await Customer.findById(mongoose.Types.ObjectId(req.query.customerId));
      companyId = customer.companyId;
    } else if(req.query.customerId) {
      companyId = req.query.customerId;
    }

    let timeslotData = await TimeSlotHelper.getAllTimeSlots(companyId, req.query.latitude, req.query.longitude)
    if (timeslotData.store == null) {
      return res.status(400).json({
        error: true,
        message: 'No Store available in your area'
      });
    } else if (timeslotData) {
      return res.json({
        error: null,
        data: {
          slots: timeslotData.slots,
          store: timeslotData.store,
          services: timeslotData.services,
          coupons: timeslotData.coupons
        }
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'No TimeSlots Available'
      });
    }
    
  
   
};

exports.updateTimeslot = async (req, res) => {
  //try {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Not authorized to access !'
      });
    }
    // validation of post data
    // check if timeSlots key exists or not
    if (
      typeof req.body.timeSlots === 'undefined' &&
      req.body.timeSlots === ''
    ) {
      return res.status(401).json({
        error: true,
        message: 'Please enter a valid input ! '
      });
    }
    console.log('aaaaaa');

    console.log('store : ' + req.query.storeId);
    console.log('slotType : ' + req.query.slotType);
    if (
      typeof req.query.storeId !== 'undefined' &&
      req.query.storeId !== '' &&
      (typeof req.query.slotType === 'undefined' || req.query.slotType === '')
    ) {
      console.log('bbbbbbb');
      return res.status(401).json({
        error: true,
        message: 'Please enter a valid input ! '
      });
    }
    if (
      typeof req.query.storeId === 'undefined' &&
      req.query.storeId === '' &&
      (typeof req.query.slotType !== 'undefined' || req.query.slotType !== '')
    ) {
      console.log('cccccccc');
      return res.status(401).json({
        error: true,
        message: 'Please enter a valid input ! '
      });
    }
    console.log('ddddddd');
    if (
      typeof req.query.storeId !== 'undefined' &&
      req.query.storeId !== '' &&
      typeof req.query.slotType !== 'undefined' &&
      req.query.slotType !== ''
    ) {
      console.log('eeeeeeeeeeeeee');

      
      if (req.query.slotType === 'masterSlots' || req.query.slotType === 'tempSlots') {
        let data = req.body[req.query.slotType];
        const slots = data.map(slot => {
          let s = {
            timeslot: slot.timeslot,
            visibility: slot.visibility,
            slots: slot.slots
          };
          return s;
        });
        let updataObj = {};
        updataObj[req.query.slotType] = slots;
        console.log('updataObj', updataObj)
        let updateStore = await store.findOneAndUpdate(
          {
            _id: req.query.storeId
          },
          {
            $set: updataObj
          },
          {
            new: true,
            useFindAndModify: false
          }
        );
        let resp = {};
        resp[req.query.slotType] = updateStore[req.query.slotType];
        if (updateStore) {
          res.status(200).json({
            error: null,
            message: 'Timeslot for the store updated successfully',
            data: resp
          });
        } else {
          return res.status(400).json({
            error: true,
            message: 'Timeslot not updated. Please try again'
          });
        }
      } else {
        return res.status(401).json({
          error: true,
          message: 'Please enter a valid input ! '
        });
      }
    } else {
      console.log('Updating Master timeslots')
      let timeSlots = req.body.timeSlots;
      let companyId = req.query.companyId
        ? req.query.companyId
        : req.user.companyId;
      if (Array.isArray(timeSlots) && timeSlots.length > 0) {
        console.log('Updaing1');
        let updated = null;
        for (let i = 0; i < timeSlots.length; i++) {
          timeSlots[i].companyId = companyId;
          console.log('Updaing2', timeSlots[i]);
          if (timeSlots[i]._id) {
            console.log('Updaing');
            updated = await TimeSlot.updateOne(
              {
                _id: timeSlots[i]._id
              },
              timeSlots[i]
            );
          } else {
            console.log('Inserting');
             
            const timeslotData = new TimeSlot(timeSlots[i]);
            try{
            let timeslot = await timeslotData.save();
            const comapnyInfo = await company.findById({
              _id: companyId
            });
            await comapnyInfo.timeSlots.push(timeslot._id);
            updated = await comapnyInfo.save();
          }catch(e){
            console.log('eee',e)
          }
          }
        }
        const companyData = await company.findById(companyId).populate({
          path: 'timeSlots',
          options: {
            sort: {
              order: 1
            }
          }
        });

        if (updated) {
          res.status(200).json({
            error: null,
            message: 'Timeslot updated successfully',
            data: {
              timeSlots: companyData.timeSlots
            }
          });
        } else {
          return res.status(400).json({
            error: true,
            message: 'Timeslot not updated. Please try again'
          });
        }
      } else {
        return res.status(400).json({
          error: true,
          message: 'Invalid data. Please try again'
        });
      }
    }
    /*
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message
    });
  }
  */
};

exports.deleteTimeslot = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Not authorized to access !'
      });
    }

    if (
      typeof req.query.companyId !== 'undefined' &&
      req.query.companyId == 24
    ) {
      let updateCompany = await company.findOneAndUpdate(
        {
          _id: req.query.companyId
        },
        {
          $set: {
            timeSlots: []
          }
        },
        {
          useFindAndModify: false
        }
      );
      if (updateCompany) {
        res.status(200).json({
          error: null,
          message: 'Timeslot deleted successfully'
        });
      }
    } else {
      return res.status(400).json({
        error: true,
        message: 'Timeslot not updated. Please try again'
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message
    });
  }
};
