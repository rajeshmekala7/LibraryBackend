var cors = require('cors');
var morgan = require('morgan');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');


var config = require('./config/config');
var UserRoutes = require('./routes/user');
var app = express();
// app.use(express.static('client',{index:'/views/index.html'}));
app.use(cookieParser());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json({limit: config.bodyParserLimit}));

// app.use(bodyParser.urlencoded({limit: config.bodyParserLimit, extended: true}));

app.use('/user', UserRoutes.OpenRouter);

app.use(function(req,res, next){
  if(/^\/user\//.test(req.url)) {
    next();
  } 
  else{
    console.log("you have entered invalid url")
 }
});



app.use(function (req, res, next) {
    // console.log('====auth===',req);
         if (!req.headers.token) {
            res.sendStatus(401).json({status: false, message: 'No token'});
        } else {
            jwt.verify(req.headers.token, config.jwt.secret, function (err, decoded) {
                 console.log('===>',decoded);
                if (err) {
                    res.sendStatus(401).json({status: false, message: 'Not Authorized'});
                } else {
                    req.jwt = decoded;  //{id: user._id,email: user.email}
                    next();
                }
            });
        }
    });

app.use('/user', UserRoutes.AuthRouter);

app.listen(config.port, function () {
    console.log('started up on port' ,config.port);
});