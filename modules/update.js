var config = require('./../config/config');
var _ = require('underscore');
var mongoose = require('mongoose');
var bcrypt=require('bcrypt');
var registerCollection = require('./../models/schema').registerCollection;
var Formula = function () {
};

Formula.prototype.update=function(body,callback){
    var retObj={}
    if(!body.email){
       retObj.message="enter your emai"
       callback(retObj)  
    }
    else {
        buyCollection.findOneAndUpdate({email:body.email}, body, function(error, result){
        console.log("enter your email", body);                    
            if(error){
                console.log('err',error);
                retObj.status = false;
                retObj.message = "error";
                callback(retObj);
            }
            else if(body.password){
               console.log('you cant change password here')
               retObj.message="you cant change password here"
               callback(retObj)
            }
            else if(result){
                console.log('update successful');
                retObj.status = true;
                retObj.message = "update successful";
                retObj.pass=result.password;
                callback(retObj);
            }
            else{
                console.log('else')
                retObj.message="entered wrong email"
                callback(retObj)
            }
        })
    }
}