/*jslint node: true */
/*jslint white:true */
/*jslint nomen:true */
/*jslint es5:true */

'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Order = require('../models/orders');
var Verify = require('./verify');

var orderRouter = express.Router();
orderRouter.use(bodyParser.json());

orderRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
      Order.find({})
        .populate('chef')
        .populate('customer')
        .populate('dishes.dish')
        .exec(function (err, order) {
        if (err) {throw err;}
        console.log('get order %s ' , order);
        res.json(order);
    });
})
.post(Verify.verifyOrdinaryUser, Verify.verifyChef, function (req, res, next) {
     Order.findOneAndUpdate(
         {customer: req.body.customer, chef:req.body.chef, status:'new'},
         {$setOnInsert : {dishes: []}},
         {upsert:true , new:true},
         function(err,order) {
            if (err) {throw err;}
            console.log('order added %s ', order);
            res.json(order);
         }
     );
    
});
orderRouter.route('/:orderId')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Order.findById(req.params.orderId)
        .populate('chef')
        .populate('customer')
        .populate('dishes.dish')
        .exec(function (err, order) {
        if (err) {throw err;}
        res.json(order);
    });
})
.put(Verify.verifyChef, function (req, res, next) {
    console.log(req.params.orderId);
    console.log(req.body.status);
    Order.findByIdAndUpdate(req.params.orderId, {
        $set: req.body
    }, {
        new: true
    }, function (err, order) {
        if (err) {
            throw err;
        }
        res.json(order);
    });
})

orderRouter.route('/:orderId/dishes')
.all(Verify.verifyOrdinaryUser)
.get(function (req, res, next) {
    Order.findById(req.params.orderId)
        .populate('dishes.dish')
        .exec(function (err, order) {
        if (err) {throw err;}
        res.json(order.dishes);
    });
})

.post( function (req, res, next) {
    console.log('posting dishes');
    Order.findById(req.params.orderId, function (err, order) {
        if (err) {throw err;}
        console.log('Pushing order dishes: %s', req.body);
        order.dishes.push(req.body);
        order.save(function (err, order) {
            if (err) {throw err;}
            console.log('Updated Dishes for orders!');
            res.json(order);
        });
    });
});


/*.put(Verify.verifyOrdinaryUser, Verify.verifyChef, function (req, res, next) {
    console.log('Update menu %s', req.body._id);
    console.log('req %s' , req.body);
    Menu.remove(
        {_id: req.body._id})
        .exec(function (err, menu) {
            if (err) {throw err;}
            res.json(menu);
        }); 

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
});*/

module.exports = orderRouter;