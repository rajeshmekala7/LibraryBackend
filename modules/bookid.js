var config = require('./../config/config');
var _ = require('underscore');
var mongoose = require('mongoose');
var bcrypt=require('bcrypt');
var registerCollection = require('./../models/schema').registerCollection;
var Formula = function () {
};

Formula.prototype.bookid=function(body,callback){
    var retObj={}
    console.log('your in book id')
    if(!body.email){
       retObj.message="enter email"
       callback(retObj)
    }
    else if(!body.book1 && !body.book2 && !body.book3){
       retObj.message="no book value entered"
       callback(retObj)
    }
    else{
        buyCollection.findOneAndUpdate({email:body.email},body,function(err,data)
         {
             console.log('your here')
             if(err)
             {
                 retObj.message="error has occured"
                 callback(retObj)
             }
             else if(data){
                 console.log('books are updated')
                 retObj.message="books are updated"                   
                 retObj.data=body
                 callback(retObj)
            }
           else{
                retObj.message="user not found"
                callback(retObj)
           }
         })

    }
}