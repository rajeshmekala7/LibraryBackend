var config = require('./../config/config');
var _ = require('underscore');
var mongoose = require('mongoose');
var bcrypt=require('bcrypt');
var registerCollection = require('./../models/schema').registerCollection;
var Formula = function () {
};

Formula.prototype.read=function(callback){
    var retObj={}
    buyCollection.find({email:"mekalarajeshreddy@gmail.com"}, function(error, data){
        if(error){
            console.log('err',error);
            retObj.status = false;
            retObj.message = "error";
            callback(retObj);
        }else{
            console.log('else');
            retObj.status = true;
            retObj.message = "fetch successful";
            retObj.data = data;
            callback(retObj);
        }
    })
}