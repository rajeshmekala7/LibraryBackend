var cors = require('cors');
var morgan = require('morgan');
var express = require('express');
var bodyParser = require('body-parser');
// var jwt = require('jsonwebtoken');


var config = require('./config/config');
var UserRoutes = require('./routes/user');
var app = express();
// app.use(express.static('client',{index:'/views/index.html'}));
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json({limit: config.bodyParserLimit}));
// app.use(bodyParser.urlencoded({limit: config.bodyParserLimit, extended: true}));

app.use(function(req,res, next){
if(/^\/user\//.test(req.url)) {
   next();
} 
else{
    console.log("you have entered invalid url")
}
});


app.use('/user', UserRoutes.OpenRouter);

app.listen(config.port, function () {
    console.log('started up on port' ,config.port);
});