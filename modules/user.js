var config = require('./../config/config');
var _ = require('underscore');
var mongoose = require('mongoose');
var bcrypt=require('bcrypt');
var buyCollection = require('./../models/schema').buyCollection;
var Formula = function () {
};

Formula.prototype.registration=function(body,callback){
    var retObj={}
    if(!body.userName)
    {
       retObj.message="username should contain only alphabets"
       callback(retObj)
    }else if(!_.isString(body.email)){
          retObj.message="enter correct email"
          callback(retObj)
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
         buyCollection.findOne({email:body.email},function(err,data)
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
                var user = new buyCollection({
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
                        retObj.message = "reg success";
                        retObj.data = data;
                        callback(retObj);
                    }   
               })
            }
         })
     }

}


Formula.prototype.login = function (body, callback) {
    var retObj={}
    if(!body.email)
    {
        console.log("please enter you email")
        retObj.message="enter email"
        callback(retObj)
    }
    else if(!body.password)
    {
        console.log("please enter you password")
        retObj.message="enter password"
        callback(retObj)
    }
    else{
        buyCollection.findOne({email:body.email},function(err,doc)
       {
         if(err){
             console.log("please try again")
             retObj.message="please try again"
             callback(retObj)
          }
          else if(doc)
          {
              console.log("doc",doc);
              if(bcrypt.compareSync(body.password,doc.password))
              {
                    retObj.message="login successful"
                    console.log("login successful")
                    callback(retObj)
              }
              else{
                  console.log("wrong password")
                  retObj.message="wrong password"
                  callback(retObj)
              }
          }
          else{
              console.log("user not in database")
              retObj.message="user not in database"
              callback(retObj)
          }
       }
    )}
}


module.exports = new Formula();