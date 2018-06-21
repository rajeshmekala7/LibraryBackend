var config = require('./../config/config');
var _ = require('underscore');
var mongoose = require('mongoose');
var bcrypt=require('bcrypt');
var registerCollection = require('./../models/schema').registerCollection;
var Formula = function () {
};

Formula.prototype.changePassword=function(body,callback){
    var retObj={}
    buyCollection.findOne({email:body.email},function(err,data){
        console.log('your in change password')
        if(err){
            console.log('error has occured')
            retObj.message="error has occured"
            callback(retObj)
        }
        else if(data){
            if(bcrypt.compareSync(body.password,data.password))
            {
                console.log('password sync is occuring')
                var hash=bcrypt.hashSync(body.newPassword, 10);
                console.log('hash',hash)
                buyCollection.findOneAndUpdate({email:body.email},{
                    $set:{
                        password:hash
                    }
                },function(err,data){
                   console.log('your password has been updated')
                    retObj.message="your password has been updated"
                    callback(retObj)
                })
            }
            else{
                console.log('your current password is wrong ')
                retObj.message="your current password is wrong"
                callback(retObj)
            }
        }
        else{
            retObj.message="user doesnt exists"
            callback(retObj)
        }
    })
}