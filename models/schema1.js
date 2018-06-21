var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('./../config/config');

mongoose.connect(config.mongodb.url);

var registerSchema=new Schema({
    userName:String,
    email: String,
    phone: Number,
    password: String,
    confirmPassword:String,
    newPassword:String,
})

var bookschema=new Schema({
    email:String,
    book1:String,
    book2:String,
    book3:String
})

    


var registerCollection = mongoose.model('user',registerSchema,'user');
var bookCollection=mongoose.model('books',bookschema,'books')
module.exports = {

    registerCollection,
    bookCollection
};