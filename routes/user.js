var express = require('express');
var OpenRouter = express.Router();
var AuthRouter=express.Router();

var user = require('./../modules/user');

OpenRouter.post('/register', function (req, res) {
    user.registration(req.body, function (response) {
        res.json(response);
    });
});


// user mail verification
OpenRouter.get('/verifymail/:id', function (req, res) {
    // console.log('verifyemail',req);
    user.verifyMail(req.params.id, function (result) {
        res.json(result);
    })
});

OpenRouter.post('/login', function (req, res) {
    user.login(req.body, function (response) {
        // console.log('login',req);
        res.json(response);
    });
});


AuthRouter.post('/update', function (req, res) {
    user.update(req.jwt,req.body, function (response) {
        res.json(response);
    });
});

AuthRouter.get('/read', function (req, res) {
    // console.log("ID",req.jwt, req)
    user.read(req.jwt, function (response) {
        // console.log(res)
        res.json(response);
    });
});

OpenRouter.post('/delete', function (req, res) {
    user.delete(req.body, function (response) {
        res.json(response);
    });
});

AuthRouter.post('/changepassword', function (req, res) {
    user.changePassword(req.jwt,req.body, function (response) {
        res.json(response);
    });
});

AuthRouter.post('/bookid',function(req,res){
    user.bookid(req.jwt,req.body,function(response){
        res.json(response);
    })
})


AuthRouter.post('/updatebookid',function(req,res){
    user.updatebookid(req.jwt,req.body,function(response){
        res.json(response);
    })
})




module.exports = {
    OpenRouter: OpenRouter,
   AuthRouter:AuthRouter
};