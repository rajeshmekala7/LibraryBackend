var config = require('./../config/config');
var _ = require('underscore');
var mongoose = require('mongoose');
var bcrypt=require('bcrypt');
var buyCollection = require('./../models/schema').buyCollection;
var Formula = function () {
};

Formula.prototype.registration=function(body,callback){
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
                        retObj.message = "registration successfull";
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
            }else if(result){
                console.log('update successful');
                retObj.status = true;
                retObj.message = "update successful";
                callback(retObj);
            }
            else{
                console.log('else')
                retObj.message="entered wrong email"
                callback(retObj)
            }
        })
    //     console.log("enter your email", body);        
    //     buyCollection.findOne({email:body.email}, function(err,data)
    //     {
    //         console.log("your in update")
    //          if(err){
    //              console.log("error has occured")
    //              retObj.message="error has occured"
    //              callback(retObj)
    //          }
    //          else if(data){
               
    //              console.log("your data has matched", data.email);
    //              buyCollection.update({email:data.email},
    //             //    ,{
    //             //        $set:{
    //             //            phone:body.phone
    //             //        }, 
            
    //                 body,  )
    //             retObj.message="your data has been updated"
    //             callback(retObj)
    //          }
    //          else{
    //              console.log("user doesnt exists")
    //              retObj.message="user doesnt exists"
    //              callback(retObj)
    //          }
    //     })

    }

}

Formula.prototype.read=function(callback){
    var retObj={}
    buyCollection.find({}, function(error, data){
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

Formula.prototype.delete=function(body,callback){
    var retObj={}
    buyCollection.findOneAndDelete({email:body.email}, function(error, data){
        console.log('entered into delete')
        if(error){
            console.log('err',error);
            retObj.status = false;
            retObj.message = "error";
            callback(retObj);
        }else if(data){
            console.log('else');
            retObj.status = true;
            retObj.message = "deleted successful";
            retObj.data = data;
            callback(retObj);
        }
        else{
            console.log('enetered email is not in database')
            retObj.messgae="entered email is not in database"
            callback(retObj)
        }
    })
}
module.exports = new Formula();