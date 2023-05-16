const company = require('../../models/company');
const staff = require('../../models/staff');
const bcrypt = require('bcryptjs');
const companyMiddleware = require('../../middlewares/companyMiddleware');

exports.getCompanyById = async (req, res, next, id) => {
  try {
    await company.findById(id).populate('timeSlots').exec((error, company) => {
      if (error || !company) {
        return res.status(400).json({
          error: true,
          message: 'Company not exist',
        });
      }
      req.companyData = company;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.insertCompany = async (req, res) => {
  try {
    // check if same company already exists
    let companies = await company.find();
    if (companies) {
      // check if same company exists or not
      const isDuplicateName = await companyMiddleware.isDuplicateCheckValidation(
        companies,
        req.body,
        'name'
      );
      if (isDuplicateName) {
        return res.status(400).json({
          error: true,
          message: 'Company name already exists',
        });
      }
      // check if same company mobile exists or not
      const isDuplicateMobile = await companyMiddleware.isDuplicateCheckValidation(
        companies,
        req.body,
        'mobile'
      );
      if (isDuplicateMobile) {
        return res.status(400).json({
          error: true,
          message: 'Mobile number already exists',
        });
      }
      // check if same company exists or not
      const isDuplicateCode = await companyMiddleware.isDuplicateCheckValidation(
        companies,
        req.body,
        'code'
      );
      if (typeof isDuplicateCode !== 'undefined') {
        return res.status(400).json({
          error: true,
          message: 'Company code already exists',
        });
      }
    }
    // insert into company table
    const newCompany = new company({
      name: req.body.companyName,
      code: req.body.companyCode,
      logo: req.body.companyLogo,
      ownerName: req.body.companyOwnerName,
      ownerMobile: req.body.companyOwnerMobile,
      ownerMobileAlternate: req.body.companyOwnerMobileAlternate,
      //createdBy: req.user._id,
      //createdType: req.user.userType, // staff, customer,
      tnc: req.body.tnc || '',
      tagline: req.body.tagline || '',
      notificationSettings: req.body.notificationSettings || {email: false, sms: false},
      paymentGateway: req.body.paymentGateway || '',
      documents: req.body.documents || [],
      orderIdPrefix: req.body.orderIdPrefix || '',
      timezone: req.body.timezone || '',
      currency: req.body.currency || '',
      CIN: req.body.CIN || '',
      GST: req.body.GST || '',
      supportMobileNo: req.body.supportMobileNo || '',
      supportWhatsappNo: req.body.supportWhatsappNo || '',
      checkoutTerms: req.body.supportEmailSettings || '',
      supportEmailSettings: req.body.supportEmailSettings || {},
      supportTimings: req.body.supportTimings || {}
    });
    
    let insertCompany = await newCompany.save();
    //console.log('aaaa : ' + insertCompany);
    if (insertCompany) {
      //console.log('iffff');
      let newCompanyId = insertCompany._id;
      //console.log(newCompanyId);
      // hash the password
      const salt = await bcrypt.genSalt(10);
      const encryptPassword = await bcrypt.hash(
        req.body.companyOwnerMobile,
        salt
      );
      // insert company owner details in staff table
      const newStaff = await new staff({
        companyId: newCompanyId,
        staffFirstName: req.body.companyOwnerName,
        staffLastName: 'test',
        //staffEmailId: req.body.staffEmailId,
        staffMobile: req.body.companyOwnerMobile,
        staffAlternateMobile: req.body.companyOwnerMobileAlternate,
        password: encryptPassword,
        //staffProof: req.body.staffProof, // JSON
        //staffBankDetails: req.body.staffBankDetails, // JSON
        staffEmployeeType: req.body.staffEmployeeType, //  Array
        staffStatus: req.body.staffStatus,
        isEmployeeStoreOwner: false,
        isCompanyOwner: true,
      });
      let insertStaff = newStaff.save();
      if (insertStaff) {
        res.status(200).json({
          error: false,
          message: 'Company added successfully',
        });
      } else {
        return res.status(400).json({
          error: true,
          message: 'Something went wrong. Please try again - add company owner',
        });
      }
    } else {
      return res.status(400).json({
        error: true,
        message: 'Not able to insert user in DB - company',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.getAllCompanies = async (req, res) => {
  try {
    await company.find().exec((error, company) => {
      if (error || !company) {
        return res.status(400).json({
          error: true,
          message: 'Companies not found',
        });
      }
      res.json({
        error: true,
        data: {
          company,
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.getCompany = async (req, res) => {
  try {
    return res.json({
      error: false,
      data: req.companyData,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    // check if same company already exists
    let companies = await company.find();
    if (companies) {
      // check if same company exists or not
      const isDuplicateName = await companyMiddleware.isDuplicateCheckValidationUpdate(
        companies,
        req.body,
        'name',
        req.query.id
      );
      if (isDuplicateName) {
        return res.status(400).json({
          error: true,
          message: 'Company name already exists',
        });
      }
      // check if same company mobile exists or not
      const isDuplicateMobile = await companyMiddleware.isDuplicateCheckValidationUpdate(
        companies,
        req.body,
        'mobile',
        req.query.id
      );
      if (isDuplicateMobile) {
        return res.status(400).json({
          error: true,
          message: 'Mobile number already exists',
        });
      }
      // check if same company exists or not
      const isDuplicateCode = await companyMiddleware.isDuplicateCheckValidationUpdate(
        companies,
        req.body,
        'code',
        req.query.id
      );
      if (typeof isDuplicateCode !== 'undefined') {
        return res.status(400).json({
          error: true,
          message: 'Company code already exists',
        });
      }
    }
    req.body.updatedBy = req.user._id;
    req.body.updatedType = req.user.userType; // staff, customer
    let updateCompany = await company.findByIdAndUpdate(
      { _id: req.query.id },
      { $set: req.body },
      { new: true, useFindAndModify: false }
    );
    if (updateCompany) {
      res.status(201).json({
        error: false,
        data: updateCompany,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Company not updated. Please try again',
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
