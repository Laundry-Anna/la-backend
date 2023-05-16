const https = require('https');
const http = require('http');
var config = require('../../config');
require('dotenv').config();

var LocationUtils = function(){

    var self = this;
    this.checkCoordinates = function(x, y, storePolygon){
       
        
        let pX=[], pY=[];
        for(let k=0;k<storePolygon.length;k++){
            pX.push(storePolygon[k][0]);
            pY.push(storePolygon[k][1]);
        }
        let i, j=pX.length-1 ;
        let odd = false;
        /*
        let pX = cornersX;
        let pY = cornersY;
        */
        for (i=0; i<pX.length; i++) {
            if ((pY[i]< y && pY[j]>=y ||  pY[j]< y && pY[i]>=y)
                && (pX[i]<=x || pX[j]<=x)) {
                  odd ^= (pX[i] + (y-pY[i])*(pX[j]-pX[i])/(pY[j]-pY[i])) < x; 
            }
            j=i; 
        }
    
        return odd;     
    }
}
module.exports = new LocationUtils();
