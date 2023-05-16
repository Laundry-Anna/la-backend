const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs')
var path = require("path");

var Utils = function () {
    var self = this;

    
    this.prepareModelObject = function(Model, payload) {
        const props = Object.keys(Model.schema.paths);
        //console.log(props, payload);
        let modelObject = {};
        props.forEach(key => {
            if(payload.hasOwnProperty(key)) {
                modelObject[key] = payload[key];
            }
        });
        /* Delete AgentId if userRole is not 'AgentUser' */
        if(Model.modelName == 'user') {
            if(payload.hasOwnProperty('agentId') && payload['userRoleId'] != 30) {
                delete modelObject['agentId'];
            }
        }
        return modelObject;
    }
    
    this.createToken = async function (data) {
        let token = ""
        try {
            token = await jwt.sign(data, secret, {
                algorithm: 'HS256',
                expiresIn: "10h"
            });
        } catch (e) {
            console.log(e)
            return false
        }
        return token;
    }

    this.sendReply = function(statusCode, message, reply, data, error) {
       
        return reply.status(statusCode).json({
            error: error,
            message: message,
            data: data
        });    
    }

    this.sendError = function(message, reply, data) {
       
        return reply.status(400).json({
            error: true,
            message: message,
            data: data
        });    
    }

    this.encryptPassword = function(password) {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, function(err, salt) {
                if (err) 
                  reject(err);
            
                bcrypt.hash(password, salt, function(err, hash) {
                    if (err) 
                        reject(err);
                    resolve(hash)
                });
            });
        })
        
     };
     
     this.comparePassword = function(plainPass, hashword) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {   
                return err == null ?
                    resolve(isPasswordMatch) :
                    reject(err);
            });
        })
     };

     this.handleFileUpload = (file, userId) => {
        return new Promise((resolve, reject) => {
            const filePath = file.hapi.filename;
            let fileName = filePath.split('/');
            let arr = fileName[fileName.length-1].split('.');
            const ext = arr[arr.length-1];
            if(!fileTypeFilter(ext)) {
                reject({status: false, message: 'The file type is not allowed'})
            }
            const uploadDir = path.join( __dirname, '../../uploads');
            console.log('Destination:', uploadDir);
            if (!fs.existsSync(uploadDir)){
                fs.mkdirSync(uploadDir);
            }
            fs.writeFile(uploadDir+'/'+userId+'.'+ext, file._data, err => {
                if (err) {
                    reject({status: false, message: err})
                }
                resolve({ fileName: userId+'.'+ext, status: true })
            })
        })
    }

    const fileTypeFilter = function (fileName) {
        if (!fileName.match(/\.(jpg|jpeg|png|gif|doc|docx|pdf|xls|ppt)$/)) {
            return false;
        }
    
        return true;
    };

}
module.exports = new Utils();




