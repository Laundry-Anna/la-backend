const https = require('https');
const http = require('http');
var config = require('../../config');
require('dotenv').config();

var SMSUtils = function(){

    var self = this;
    this.send = function(mobileNos, route=4, message){
        return new Promise(function(resolve,reject){
            let apiUrl = config.smsConfig.host +'?authkey='+process.env.SMSAuthKey;
            apiUrl+='&mobiles='+mobileNos+'&message='+message+'&sender='+config.smsConfig.senderId+'&country=91&route='+route;
            
            http.get(apiUrl, (resp) => {
                let data = '';
                
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                resp.on('end', () => {
                    const resp = JSON.parse(data);
                    if(resp.type && resp.type=='success'){
                        resolve({success:true, message: 'SMS Sent Successfully'});
                    } else if(resp.type && resp.type=='success') {
                        resolve({success:false, message: resp.message});
                    } else {
                        resolve({success:false, message: 'SMS Sending failed'})
                    }               
                });

            }).on("error", (err) => {
                reject({success:false, message: 'SMS Sending failed'})
            });

        })        
    }

    this.getMessageStatus = function(){
        
    }

}
module.exports = new SMSUtils();
