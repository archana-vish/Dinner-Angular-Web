/*jslint node: true */
/*jslint white:true */
/*jslint nomen:true */
/*jslint es5:true */

'use strict';

var express = require('express');
var app = express();
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify    = require('./verify');


/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}, function(err, user) {
      if(err) {
          throw err;
      }
      res.json(user);
  });
});

router.post('/signup', function(req, res) {
    User.register(new User(
        { 
            username : req.body.username, 
            emailid: req.body.emailid,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            location: req.body.location,
            phone: req.body.phone,
            chef: req.body.chef
        }),
        req.body.password, function(err, user) {
        if (err) {
            return res.status(500).json({err: err});
        }
        
        /*if(req.body.firstname) {
            user.firstname = req.body.firstname;
        }
        if(req.body.lastname) {
            user.lastname = req.body.lastname;
        }
        if(req.body.emailid) {
            user.emailid = req.body.emailid;
        }
        if(req.body.location) {
            user.location = req.body.location;
        }
        if(req.body.phone) {
            user.phone = req.body.phone;
        }
        if(req.body.chef) {
            user.chef = req.body.chef;
        } */
        
        
        /*user.save(function(err,user) {
            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({status: 'Registration Successful!'});
            });
        });*/
        
        
        passport.authenticate('local')(req, res, function () {
            return res.status(200).json({status: 'Registration Successful!'});
        }); 
    });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
        console.log('erro logging in...');
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
        
      //var token = Verify.getToken(user);
       var token = Verify.getToken({"username":user.username, "_id":user._id, "chef":user.chef});
              res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
  })(req,res,next);
});

router.get('/logout', function(req, res) {
    req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

module.exports = router;