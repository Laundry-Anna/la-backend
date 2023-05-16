const masterstafftype = require('../../models/masterstafftype');

exports.getAllStaffTypes = async (req, res) => {
  try {
    const staffTypes = await masterstafftype.find().exec();
    if (!staffTypes) {
      return res.status(400).json({
        error: true,
        message: 'Staff types not found',
      });
    }
    res.json({
      error: false,
      data: {
        staffTypes,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
exports.insertStaffType = async (req, res) => {
  try {
    const { staffEmployeeType } = req.body;
    // check if same employee type already exists
    let validateCheck = await masterstafftype.findOne({ staffEmployeeType });
    if (validateCheck) {
      return res.status(400).json({
        error: true,
        message: 'Staff type already exists',
      });
    }
    const newStaffType = new masterstafftype({
      staffEmployeeType: req.body.staffEmployeeType,
    });
    newStaffType.save((error, staffType) => {
      if (error) {
        return res.status(400).json({
          error: true,
          message: 'Not able to insert user in DB - staffType',
        });
      }
      res.json({
        error: false,
        message: 'Staff type added successfully',
      });
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
