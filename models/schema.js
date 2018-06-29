var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('./../config/config');

mongoose.connect(config.mongodb.url);

var buySchema=new Schema({
    name:String,
    email: String,
    rollno: String,
    branch: String,
    phone: Number,
    password: String,
    confirmPassword:String,
    newPassword:String,
    isVerified:{type:Boolean,default:false},
    book1:String,
    book2:String,
    book3:String,
    bookname:String
})

var adminSchema=new Schema({
    username:String,
    pwd:String
})

var buyCollection = mongoose.model('user',buySchema,'user');
var adminCollection = mongoose.model('admin',adminSchema,'admin');

module.exports = {
   adminCollection:adminCollection,
    buyCollection:buyCollection
};