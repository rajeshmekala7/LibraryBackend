var config = require('./../config/config');
var _ = require('underscore');
var mongoose = require('mongoose');
var bcrypt=require('bcrypt');
var registerCollection = require('./../models/schema').registerCollection;
var Login = function () {
};
Login.prototype.login = function (body, callback) {
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
        registerCollection.findOne({email:body.email},function(err,doc)
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

module.exports=new Login();