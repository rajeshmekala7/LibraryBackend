var express = require('express');
var OpenRouter = express.Router();
var AuthRouter=express.Router();

var admin=require('./../modules/admin');
var user=require('./../modules/user');

OpenRouter.post('/adminregister', function (req, res) {
    admin.adminregister(req.body, function (response) {
         res.json(response);
     });
 });

OpenRouter.post('/signin', function (req, res) {
   admin.signin(req.body, function (response) {
        res.json(response);
    });
});

AuthRouter.get('/read', function (req, res) {
    user.read(req.jwt, function (response) {
        res.json(response);
    });
});


AuthRouter.post('/updatebookid',function(req,res){
    user.updatebookid(req.jwt,req.body,function(response){
        res.json(response);
    })
})

module.exports={
    OpenRouter:OpenRouter
}