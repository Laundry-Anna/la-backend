const membership = require('../models/membership');
const membershipMiddleware = require('../middlewares/membershipMiddleware');

exports.insertMembership = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Not authorized to access !',
      });
    }
    // check if item already exists for companyid
    let memberships = await membership.find(
      {
        companyId: req.user.companyId,
      },
      { planName: 1, _id: 0 }
    );
    if (memberships) {
      // check if same category name exists in the company
      const hasValue = await membershipMiddleware.insertMembershipExistsInJSON(
        memberships,
        req.body.planName
      );
      if (typeof hasValue !== 'undefined') {
        return res.status(400).json({
          error: true,
          message: 'Membership with same name already exists',
        });
      }
    }
    // insert into item table
    const newPlan = new membership({
      companyId: req.user.companyId,
      planName: req.body.planName,
      planAmount: req.body.planAmount,
      planCreditAmount: req.body.planCreditAmount,
      planDescription: req.body.planDescription,
      planStartDate: req.body.planStartDate,
      planEndDate: req.body.planEndDate,
      createdBy: req.user._id,
      createdType: req.user.userType, // staff, customer
      status: req.body.status,
    });
    newPlan.save((error, item) => {
      if (error) {
        return res.status(400).json({
          error: true,
          message: 'Not able to insert membership in DB',
        });
      }
      res.json({
        error: false,
        message: 'Membership plan added successfully',
      });
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.updateMembership = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Not authorized to access !',
      });
    }
    if (typeof req.query.id === 'undefined' && req.query.id === '') {
      return res.status(400).json({
        error: true,
        message: 'Please enter valid query input',
      });
    }
    // check if item already exists for companyid
    let memberships = await membership.find(
      {
        companyId: req.user.companyId,
      },
      { planName: 1, _id: 1 }
    );
    if (memberships) {
      // check if same category name exists in the company
      const hasValue = await membershipMiddleware.updateMembershipExistsInJSON(
        memberships,
        req.body.planName,
        req.query.id
      );
      if (typeof hasValue !== 'undefined') {
        return res.status(400).json({
          error: true,
          message: 'Membership with same name already exists',
        });
      }
    }

    req.body.updatedBy = req.user._id;
    req.body.updatedType = req.user.userType; // staff, customer
    let updatemembership = await membership.findByIdAndUpdate(
      { _id: req.query.id },
      { $set: req.body },
      { new: true, useFindAndModify: false }
    );
    if (updatemembership) {
      res.status(200).json({
        error: false,
        data: updatemembership,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Membership plan not updated. Please try again',
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.getmembership = async (req, res) => {
  try {
    if (typeof req.query.id !== 'undefined' && req.query.id !== '') {
      let membershipData = await membership.findById(req.query.id);
      if (membershipData) {
        return res.json({
          error: false,
          data: membershipData,
        });
      } else {
        return res.status(400).json({
          error: true,
          message: 'Membership plan not exists. Please select another plan',
        });
      }
    }
    let membershipData = await membership.find({
      companyId: req.user.companyId,
    });
    if (membershipData) {
      return res.json({
        error: false,
        data: membershipData,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Membership plans does not exist for company',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
