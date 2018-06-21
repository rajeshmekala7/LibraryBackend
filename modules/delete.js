var config = require('./../config/config');
var _ = require('underscore');
var mongoose = require('mongoose');
var bcrypt=require('bcrypt');
var registerCollection = require('./../models/schema').registerCollection;
var Formula = function () {
};

Formula.prototype.delete=function(body,callback){
    var retObj={}
    buyCollection.findOneAndRemove({email:body.email}, function(error, data){
        console.log('entered into delete')
        if(error){
            console.log('err',error);
            retObj.status = false;
            retObj.message = "error";
            callback(retObj);
        }else if(data){
           console.log('your id has been deleted')
           retObj.message="your id has been deleted"
            callback(retObj)
        }
        else{
            console.log('enetered email is not in database')
            retObj.messgae="entered email is not in database"
            callback(retObj)
        }
    })
}