var config = require('./../config/config');
var _ = require('underscore');
var mongoose = require('mongoose');
var bcrypt=require('bcrypt');
var jwt = require('jsonwebtoken');

var buyCollection = require('./../models/schema').buyCollection;
var Formula = function () {
};


var SendGrid = require('sendgrid-nodejs').SendGrid;
var sgMail = require('@sendgrid/mail');
var fs = require('fs');
sgMail.setApiKey(your api key);

function sendEmail (id, email, html, callback) {
    var retObj={};
    // console.log("2345678");
                var msg = {
                   to: email,
                   from: 'mekalarajeshreddy@gmail.com',
                   subject: 'Mail Verification',
                   html: html
                };
               sgMail.send(msg, function (error, response) {
                  console.log('your in send function')
                   if (error) {
                       console.log('error has occured',error);
                       retObj.status = false;
                       retObj.message = "Please try again";
                       callback(retObj);
                   } else {
                        console.log('successfully registered')
                       retObj.status = true;
                       retObj.message = "Successfully Registered..!";
                       callback(retObj);
                   }
               });
}

Formula.prototype.registration=function(body,callback){
    var retObj={}
    if(body.role==='admin')
    {
        if(!body.email || !_.isString(body.email)){
            retObj.message="enter email"
            callback(retObj);
        }
        else if(!body.password || body.password< config.passwordLength)
        {
            retObj.message="invalid password"
            callback(retObj)
        }
        else{
            var hash=bcrypt.hashSync(body.password,10);
            var admin = new buyCollection({
                email: body.email,
                password: hash,
                role:body.role,
                isVerified:body.isVerified
            });
            admin.save(function (err, data) {
                if (err) {
                    retObj.status = false;
                    retObj.message = "plese try again";
                    callback(retObj);
                } else {
                    retObj.status=true
                    retObj.message="registration successful"
                    callback(retObj)
                }   
           })
        }
    }
    else {
    if(!body.name || !_.isString(body.name))
    {
       retObj.message="incorrect name",
       retObj.status=false
       callback(retObj)
    }else if(!body.email || !/\S+@\S+\.\S+/.test(body.email)){
          retObj.message="invalid email"
          retObj.status=false
          callback(retObj)
    }
    else if(!body.rollno || !_.isString(body.rollno)){
       retObj.message="enter your roll no"
       retObj.status=false
       callback(retObj)
    }
    else if(!body.branch || !_.isString(body.branch)){
        retObj.message="enter your branch"
        retObj.status=false
        callback(retObj)
    }else if (!body.phone || !(/[0-9]{10}/.test(body.phone))) {
        retObj.message = 'Invalid phoneNumber';
        retObj.status=false
        callback(retObj);
    }else if(!body.password || body.password.length<config.passwordLength)
    {
       retObj.message="password should be minimum of 8 characters"
       retObj.status=false
       callback(retObj)
    }else if((body.password)!== (body.confirmPassword))
     {   retObj.message="passwords doesnt match"
         retObj.status=false
        callback(retObj)
     }
     else{
         var hash=bcrypt.hashSync(body.password,10);
         console.log("hashing done",hash)
         buyCollection.findOne({email:body.email},function(err,data)
         {
             if(err){
                 retObj.message="error has occured please try again"
                 retObj.status=false
                 callback(retObj)
             }
             else if(data)
             {
                 retObj.message="user already exists"
                 retObj.status=false
                 callback(retObj)
             }
             else {
                var user = new buyCollection({
                    name: body.name, email: body.email,rollno:body.rollno,branch:body.branch, phone: body.phone,
                    password: hash
                });
                user.save(function (err, data) {
                    if (err) {
                        retObj.status = false;
                        retObj.message = "plese try again";
                        callback(retObj);
                    } else {
                        console.log('lllllll')
                        var authenticationURL = 'http://localhost:3000/user/verifymail/' + data._id;
                         html='<a target=_blank href=' + authenticationURL + '>Please Click here to Confirm your email</a>'+
                        '<p>Name:'+data.email+'</p>';
                        sendEmail(data._id, data.email, html, function (response) {
                            callback(response);
                        });
                    }   
               })
            }
         })
     }
    }
}

//verification done of mail sent
Formula.prototype.verifyMail = function (id, callback) {
    var retObj = {};
    buyCollection.findOneAndUpdate({_id: id}, {$set: {isVerified: true}}, function (error, result) {
        if (error) {
            retObj.status = false;
            retObj.message = "Error";
            callback(retObj);
        } else if (result) {
            retObj.status = true;
            retObj.message = "Success";
            callback(retObj);
        } else {
            retObj.status = false;
            retObj.message = "Invalid";
            callback(retObj);
        }
    })
};


Formula.prototype.login = function (body, callback) {
    var retObj={}
//         console.log(result);
    
    if(!body.email || !/\S+@\S+\.\S+/.test(body.email) )
    {
        retObj.message="enter email"
        retObj.status=false
        callback(retObj)
    }
    else if(!body.password || body.password.length<config.passwordLength)
    {
        retObj.status=false
        retObj.message="enter password"
        callback(retObj)
    }
    else{
        buyCollection.findOne({email:body.email},function(err,doc)
       {
         if(err){
            retObj.status=false
             retObj.message="please try again"
             callback(retObj)
          }
          else if(doc)
          {
              console.log("doc",doc);
              if(bcrypt.compareSync(body.password,doc.password))
              {
                if(doc.isVerified===true)
                {
                 jwt.sign({email:body.email,id:doc._id,role:doc.role},config.jwt.secret, function (err, token){
                    if(err){
                        console.log("please try again")
                        retObj.status=false
                        retObj.message="please try again"
                        callback(retObj)
                    }
                    else{
                     retObj.token=token
                     retObj.status=true
                     retObj.message="login successful"
                     console.log("login successful")
                     callback(retObj)
                    }
                 })
               }
               else{
                  retObj.message="please verify your email"
                  retObj.status=false
                  callback(retObj)
               }
             }
            else{
                 retObj.message="wrong password"
                 retObj.status=false
                callback(retObj)
             }
            }
          else{
              console.log("user not in database")
              retObj.status=false
              retObj.message="user not in database"
              callback(retObj)
          }
       }
    )}
}

Formula.prototype.update=function(jwt,body,callback){
    var retObj={}
    
        buyCollection.findOneAndUpdate({_id:jwt.id}, body, function(error, result){
        console.log("enter your email", body);                    
            if(error){
                console.log('err',error);
                retObj.status = false;
                retObj.message = "error";
                callback(retObj);
            }
            else if(body.email){
                console.log('email id cannot be updated')
                retObj.message="email ud cannot be updated"
                retObj.status=false
               callback(retObj)
            }
            // else if(body.branch){
            //    console.log('you cannot change your branch')
            //    retObj.message="you cannot change your branch"
            //    callback(retObj)
            // }
            else if(!body.name || !_.isString(body.name)){
              console.log('enter your name')
              retObj.message="enter your name"
              callback(retObj)
            }
            else if(result){
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


      

    }



Formula.prototype.read=function(jwt,callback){
    var retObj={}
    buyCollection.findOne({_id: jwt.id}, function(error, data){
        if(error){
            console.log('err',error);
            retObj.status = false;
            retObj.message = "error";
            callback(retObj);
        }else if(data){
            console.log('else in read');
            retObj.status = true;
            retObj.message = "fetch successful";
            retObj.data = data;
            callback(retObj);
        }
        // else{
        //     console.log('fetch not succesfull')
        //     retObj.message="fetch not succesfull"
        //     retObj.status=false
        //     callback(retObj)
        // }
    })
}

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
Formula.prototype.changePassword=function(jwt,body,callback){
    var retObj={}
    buyCollection.findOne({_id:jwt.id},function(err,data){
        console.log('your in change password')
        if(err){
            console.log('error has occured')
            retObj.message="error has occured"
            retObj.status=false
            callback(retObj)
        }
        else if(data){
            if(!body.password && !body.newPassword && !body.confirmPassword){
                  retObj.status=false,
                  retObj.message="enter all fields",
                  callback(retObj)
            }
            else if(!body.password || body.password.length<config.passwordLength){
                retObj.status=false,
                retObj.message="invalid  current password"
                callback(retObj)
            }
            else if(!body.newPassword || body.newPassword.length<config.passwordLength){
                retObj.status=false,
                retObj.message="new password should be minimum of 8 letters"
                callback(retObj)
            }
            else if(!body.confirmPassword || body.confirmPassword.length<config.passwordLength){
                retObj.status=false,
                retObj.message="confirm password should be minimum of 8 letters"
                callback(retObj)
            }
             else if(bcrypt.compareSync(body.password,data.password))
            {
              if(body.newPassword===body.confirmPassword)
              {
                console.log('password sync is occuring')
                var hash=bcrypt.hashSync(body.newPassword, 10);
                console.log('hash',hash)
                buyCollection.findOneAndUpdate({_id:jwt.id},{
                    $set:{
                        password:hash
                    }
                },function(err,data){
                   console.log('your password has been updated')
                    retObj.message="your password has been updated"
                    retObj.status=true
                    callback(retObj)
                })
              }
              else{
                retObj.status=false,
                retObj.message="passowords doesnt match"
                callback(retObj)
              }
           }
            else{
                console.log('your current password is wrong ')
                retObj.message="your current password is wrong"
                retObj.status=false
                callback(retObj)
            }
        }
        else{
            retObj.message="user doesnt exists"
            retObj.status=false
            callback(retObj)
        }
    })
}
Formula.prototype.bookid=function(jwt,body,callback){
    var retObj={}
    console.log('your in book id')
  
     if(jwt.role==="student"){
        buyCollection.findOne({_id:jwt.id},function(err,data)
         {
            console.log("Entered IF",!data.book2,"==",data,"==",body);
            if(!data.book1 && !data.book2 && !data.book3){
                console.log("First IF",!data.book2,"==",data.data,"==",body);
             buyCollection.findOneAndUpdate({_id:jwt.id},{
                $set:{
                    book1:body.book,
                    date1:body.date
                }
            },function(err,data){
              console.log('your here')
              if(err)
              {
                 retObj.message="error has occured"
                 retObj.status=false
                 callback(retObj)
              }
              else if(data){
                 retObj.message="books are updated"     
                 console.log('data is here',data)              
                 retObj.status=true
                 retObj.data=data
                 callback(retObj)
             }
             else{
                 retObj.message="user not found"
                retObj.status=false
                callback(retObj)
            }
          })
        }     
         else if(data.book1 && !data.book2 && !data.book3){
            console.log("2 IF");
            buyCollection.findOneAndUpdate({_id:jwt.id},{
                $set:{
                    book2:body.book,
                    date2:body.date
                }
            },function(err,data){
             console.log('your here')
             if(err)
             {
                retObj.message="error has occured"
                retObj.status=false
                callback(retObj)
             }
             else if(data){
                retObj.message="books are updated"     
                console.log('data is here',data)              
                retObj.status=true
                retObj.data=data
                 callback(retObj)
            }
            else{
                retObj.message="user not found"
               retObj.status=false
               callback(retObj)
           }
         })
       }     
    else if(data.book1 && data.book2 && !data.book3){
        console.log("3 IF");
        buyCollection.findOneAndUpdate({_id:jwt.id},{
            $set:{
                book3:body.book,
                date3:body.date
            }
        },function(err,data){
         console.log('your here')
         if(err)
         {
            retObj.message="error has occured"
            retObj.status=false
            callback(retObj)
         }
         else if(data){
            retObj.message="books are updated"     
            console.log('data is here',data)              
            retObj.status=true
            retObj.data=data
            callback(retObj)
        }
        else{
            retObj.message="user not found"
           retObj.status=false
           callback(retObj)
       }
     })
   }     
        })
            
            
        }
}

Formula.prototype.updatebookid=function(jwt,body,callback){
    var retObj={};
     var book={$unset:{book1:""}}
     if(jwt.role==="admin"){
      buyCollection.findOneAndUpdate({rollno:body.rollno},book,function(err,data){
            if(err){
              console.log('error')
              retObj.message="error"
              retObj.status=false
              callback(retObj)
            }
            else if(data){
                 console.log('your data has been updated')
                 retObj.message="your data has been updated"
                 retObj.status=true
                 callback(retObj)
            }   
            else{
                console.log('user not found ')
                retObj.status=false                                
                retObj.message="user not found"
                callback(retObj)
            }
            
        })
        }
     }
     Formula.prototype.getbookdetails=function(jwt,callback){
         var retObj={}
         if(jwt.role==="student"){
             buyCollection.findOne({_id:jwt.id},function(err,data){
                 if(err){
                     retObj.status=false;
                     retObj.messsage="error has occured";
                     console.log("error has occured",err)
                     callback(retObj)
                 }
                 else if(data.book1
                ){
                     console.log("qqqqqqq",data.book1);
                     retObj.status=true;
                     retObj.message="data returned";
                     retObj.data=data;
                     callback(retObj);
                 }
             });
         }
         else{
             retObj.status=false,
             retObj.message="user not found"
             callback(retObj)
         }
     }
module.exports = new Formula();