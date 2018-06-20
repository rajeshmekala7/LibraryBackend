var express = require('express');
var OpenRouter = express.Router();

var user = require('./../modules/user');

OpenRouter.post('/login', function (req, res) {
    user.login(req.body, function (response) {
        res.json(response);
    });
});

OpenRouter.post('/register', function (req, res) {
    user.registration(req.body, function (response) {
        res.json(response);
    });
});

OpenRouter.post('/update', function (req, res) {
    user.update(req.body, function (response) {
        res.json(response);
    });
});

OpenRouter.get('/read', function (req, res) {
    user.read( function (response) {
        console.log('res')
        res.json(response);
    });
});

OpenRouter.post('/delete', function (req, res) {
    user.delete(req.body, function (response) {
        res.json(response);
    });
});




module.exports = {
    OpenRouter: OpenRouter
};