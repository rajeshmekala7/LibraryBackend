var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('./../config/config');

mongoose.connect(config.mongodb.url);

var buySchema=new Schema({
    userName:String,
    email: String,
    phone: Number,
    password: String,
    confirmPassword:String,
})

var buyCollection = mongoose.model('user',buySchema,'user');

module.exports = {

    buyCollection:buyCollection
};