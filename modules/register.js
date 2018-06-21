var config = require('./../config/config');
var _ = require('underscore');
var mongoose = require('mongoose');
var bcrypt=require('bcrypt');
var registerCollection = require('./../models/schema').registerCollection;
var Register = function () {
};

Register.prototype.registration=function(body,callback){
    var retObj={}
    if(!body.userName ||!_.isString(body.userName))
    {
       retObj.message="username should contain only alphabets"
       callback(retObj)
    }else if(!_.isString(body.email)){
          retObj.message="enter correct email"
          callback(retObj)
    }else if (!body.phone || !(/[0-9]{10}/.test(body.phone))) {
        console.log(typeof body.phone);
        retObj.message = 'Invalid phoneNumber';
        callback(retObj);
    }else if(!body.password || body.password.length<8)
    {
       retObj.message="password should be minimum of 8 characters"
       callback(retObj)
    }else if((body.password)!== (body.confirmPassword))
     {   retObj.message="passwords doesnt match"
         callback(retObj)
     }
     else{
         var hash=bcrypt.hashSync(body.password,10);
         console.log("hashing done",hash)
         registerCollection.findOne({email:body.email},function(err,data)
         {
             if(err){
                 retObj.message="please try again"
                 callback(retObj)
             }
             else if(data)
             {
                 retObj.message="user already exists"
                 callback(retObj)
             }
             else {
                var user = new registerCollection({
                    userName: body.userName, email: body.email, phone: body.phone,
                    password: hash
                });
                user.save(function (err, data) {
                    if (err) {
                        retObj.status = false;
                        retObj.message = "plese try again";
                        callback(retObj);
                    } else {
                        retObj.status = true;
                        retObj.message = "registration successfull";
                        retObj.data = data;
                        callback(retObj);
                    }   
               })
            }
         })
     }

}

module.exports=new Register();