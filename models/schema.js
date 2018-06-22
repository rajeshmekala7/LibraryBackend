var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('./../config/config');

mongoose.connect(config.mongodb.url);

var buySchema=new Schema({
    name:String,
    email: String,
    phone: Number,
    password: String,
    confirmPassword:String,
    newPassword:String,
    book1:String,
    book2:String,
    book3:String
})

var buyCollection = mongoose.model('user',buySchema,'user');

module.exports = {

    buyCollection:buyCollection
};