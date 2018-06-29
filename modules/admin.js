var config = require('./../config/config');
var _ = require('underscore');
var mongoose = require('mongoose');
var bcrypt=require('bcrypt');
var jwt = require('jsonwebtoken');

var buyCollection = require('./../models/schema').buyCollection;
var adminCollection = require('./../models/schema').adminCollection;

var Formula=function(){};
var Admin=function(){};

Admin.prototype.adminregister=function(body,callback){
    var retObj={}
    if(!body.username || !_.isString(body.username)){
        retObj.message="enter username"
        callback(retObj);
    }
    else if(!body.pwd || body.pwd< config.passwordLength)
    {
        retObj.message="invalid password"
        callback(retObj)
    }
    else{
        var hash=bcrypt.hashSync(body.pwd,10);
        var admin = new adminCollection({
            username: body.username,
            pwd: hash
        });
        admin.save(function (err, data) {
            if (err) {
                retObj.status = false;
                retObj.message = "plese try again";
                callback(retObj);
            } else {
                retObj.message="registration successful"
                callback(retObj)
            }   
       })
    }

}

Admin.prototype.signin=function(body,callback){
     var retObj={}
    if(!body.username || !_.isString(body.username)){
        console.log('invalid username')
        retObj.message="invalid username",
        callback(retObj)
    }
    if(!body.pwd || body.pwd.length<config.passwordLength)
    {
        console.log('invalid password')
        retObj.message="invalid password"
        callback(retObj);
    }
    adminCollection.findOne({username:body.username},function(err,data){
       if(err){
           console.log('error has occured')
           retObj.message="error has occured"
           callback(retObj)
       }
       else if(data){
           jwt.sign({username:body.username},config.jwt.secret,function(err,token){
         if(err){
             console.log("error has occured")
             retObj.message="error has occured"
             callback(retObj)
         }
          else if(bcrypt.compareSync(body.pwd,data.pwd))
          {
            retObj.token=token
             console.log('login successful')
             retObj.message="login successful"
             callback(retObj)
         }
         else{
             console.log('incorrect password')
             retObj.message="incorrect password"
             callback(retObj)
         }
        })
       }
       else{
           console.log('user not found')
           retObj.message="user not found"
           callback(retObj)
       }
    })
}


module.exports = new Admin();