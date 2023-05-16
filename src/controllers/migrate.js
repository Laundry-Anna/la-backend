const Customer = require('../models/customer');
const Address = require('../models/address');

exports.updateAddress = async () => {
  try {
    let customers = await Customer.find();

    for(let i=0;i<customers.length; i++) {
      let addresses = customers[i].address;
      let arrAddress = [];
      for(let j=0;j<addresses.length;j++) {
        if(typeof addresses[j] === 'object' && addresses[j] !== null && addresses[j].addr1 ) {
          addresses[j].customerId = customers[i]._id;
          const address = new Address(addresses[j]);
          updated = await address.save();
          console.log('inserted', updated)
          arrAddress.push(updated._id);
        }
      }
      let updateCustomer = await Customer.findByIdAndUpdate(
        { _id: customers[i]._id },
        { $set: {address: arrAddress} },
        { new: true, useFindAndModify: false }
      );
      console.log('updated customer');
      
    }
    return;

  } catch (error) {
    console.log('Error', error)
    return;
  }
};
