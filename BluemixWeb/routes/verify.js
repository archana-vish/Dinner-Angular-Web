/*jslint node: true */
/*jslint white:true */
/*jslint nomen:true */
/*jslint es5:true */

'use strict';


var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config.js');
var err = null;

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600
    });
};
exports.verifyOrdinaryUser1 = function (req, res, next) {
    next();
};

exports.verifyChef= function(req, res, next) {
    next();
};


exports.verifyOrdinaryUser= function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];



    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                err = new Error('You are not authenticated! Token not matched');
                err.status = 401;
                return next(err);
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }
};

exports.verifyChef1 = function(req, res, next) {
    console.log('Chef flag set to :: ' + req.decoded.chef + ' for user ' + req.decoded.username);
    // check for admin privileges
    if(req.decoded.chef) {
        next();
    } else {
        var err = new Error('Not a chef!');
        err.status = 401;
        return next(err);
    }
};
