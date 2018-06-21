var config = require('./../config/config');
var _ = require('underscore');
var mongoose = require('mongoose');
var bcrypt=require('bcrypt');
var registerCollection = require('./../models/schema').registerCollection;
var Formula = function () {
};

Formula.prototype.updatebookid=function(body,callback){
    var retObj={};
    if(!body.email){
        console.log('enter your email')
        retObj.message='enter your email'
        callback(retObj)
    }
    else{
        buyCollection.findOneAndUpdate({email:body.email},{
            $unset:{
                 book3:""
            }
        },function(err,data){
            if(err){
              console.log('error')
              retObj.message="error"
              callback(retObj)
            }
            else if(data){
                 console.log('your data has been updated')
                 retObj.message="your data has been updated"
                 callback(retObj)
            }   
            else{
                console.log('user not found ')
                retObj.message="user not found"
                callback(retObj)
            }
        })
    }
}