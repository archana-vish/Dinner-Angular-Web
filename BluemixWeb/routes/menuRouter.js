/*jslint node: true */
/*jslint white:true */
/*jslint nomen:true */
/*jslint es5:true */

'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Menu = require('../models/menu');
var Verify = require('./verify');

var menuRouter = express.Router();
menuRouter.use(bodyParser.json());

menuRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
      Menu.find({})
        .populate('chef')
        .populate('dishes')
        .exec(function (err, menu) {
        if (err) {throw err;}
        console.log('get menu %s ' , menu);
        res.json(menu);
    });
})
.post(Verify.verifyOrdinaryUser, Verify.verifyChef, function (req, res, next) {
     Menu.findOneAndUpdate(
         {chef:req.body.chef, dishes: req.body._id},
         {$setOnInsert : {chef:req.body.chef, dishes:req.body._id}},
         {upsert:true , new:true},
         function(err,menu) {
            if (err) {throw err;}
            console.log('menu added %s ', menu);
            res.json(menu);
         }
     );
    
})
.put(Verify.verifyOrdinaryUser, Verify.verifyChef, function (req, res, next) {
    console.log('Update menu %s', req.body._id);
    console.log('req %s' , req.body);
    Menu.remove(
        {_id: req.body._id})
        .exec(function (err, menu) {
            if (err) {throw err;}
            res.json(menu);
        }); 
   /* Menu.remove({}, function (err, resp) {
        if (err) {throw err;}
        res.json(resp);
    });*/
});

menuRouter.route('/:menuId')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
   Menu.findOne(
        {dishes: req.params.dishId})
        .populate('dishes')
        .exec(function (err, menu) {
            if (err) {throw err;}
            res.json(menu);
        }
    ); 
})
.put(Verify.verifyOrdinaryUser, Verify.verifyChef, function (req, res, next) {
    console.log('Update one menu %s', req.body._id);
    console.log('req %s' , req.body);
    Menu.remove(
        {_id: req.body._id})
        .exec(function (err, menu) {
            if (err) {throw err;}
            res.json(menu);
        }); 
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyChef, function (req, res, next) {
    console.log('delete a dish');
   Menu.remove(
        {_id: req.body._id})
        .exec(function (err, menu) {
            if (err) {throw err;}
            res.json(menu);
        }); 
});

module.exports = menuRouter;