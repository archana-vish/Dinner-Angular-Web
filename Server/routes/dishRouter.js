/*jslint node: true */
/*jslint white:true */
/*jslint nomen:true */
/*jslint es5:true */

'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var Verify = require('./verify');
var Upload = require('./uploadImage');

var dishRouter = express.Router();
var mongoose = require('mongoose');

var Dishes = require('../models/dishes');

dishRouter.use(bodyParser.json());

dishRouter.route('/')
//.all(Verify.verifyOrdinaryUser)
.get(function (req, res, next) {
        Dishes.find({})
            .populate('chef')
            .populate('comments.customer')
            .exec(function (err, dish) {
            if (err) {throw err;}
            res.json(dish);
        });
})
.post(Verify.verifyChef, function (req, res, next) {
//.post(function (req, res, next) {
    req.body.chef = '58182134409b1a0bc34e7801'; //req.decoded._doc._id;
    Dishes.create(req.body, function (err, dish) {
        if (err) {
            throw err;
        }
        console.log('Dish created!');
        var id = dish._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the dish with id: ' + id);
    });
})

.delete(Verify.verifyChef, function (req, res, next) {
    Dishes.remove({}, function (err, resp) {
        if (err) {
            throw err;
        }
        res.json(resp);
    });
});

dishRouter.route('/:dishId')

.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Dishes.findById(req.params.dishId)
        .populate('chef')
        .populate('comments.customer')
        .exec(function (err, dish) {
        if (err) {throw err;}
        res.json(dish);
    });
})

.put(Verify.verifyChef, function (req, res, next) {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {
        new: true
    }, function (err, dish) {
        if (err) {
            throw err;
        }
        res.json(dish);
    });
})

.delete(Verify.verifyChef, function (req, res, next) {
    Dishes.findByIdAndRemove(req.params.dishId, function (err, resp) {
        if (err) {
            throw err;
        }
        res.json(resp);
    });
});

dishRouter.route('/:dishId/comments')
.all(Verify.verifyOrdinaryUser)
.get(function (req, res, next) {
    Dishes.findById(req.params.dishId)
        .populate('comments.customer')
        .exec(function (err, dish) {
        if (err) {throw err;}
        res.json(dish.comments);
    });
})

.post( function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) {throw err;}
        req.body.customer = req.decoded._doc._id;
        dish.comments.push(req.body);
        dish.save(function (err, dish) {
            if (err) {throw err;}
            console.log('Updated Comments!');
            res.json(dish);
        });
    });
})

.delete(Verify.verifyChef, function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
        var i = 0;
        if (err) {throw err;}
        for (i = (dish.comments.length - 1); i >= 0; i-1) {
            dish.comments.id(dish.comments[i]._id).remove();
        }
        dish.save(function (err, result) {
            if (err) {throw err;}
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Deleted all comments!');
        });
    });
});

dishRouter.route('/:dishId/comments/:commentId')
.all(Verify.verifyOrdinaryUser)
.get(function (req, res, next) {
    Dishes.findById(req.params.dishId)
        .populate('comments.customer')
        .exec(function (err, dish) {
        if (err) {throw err;}
        res.json(dish.comments.id(req.params.commentId));
    });
})

.put(function (req, res, next) {
    // We delete the existing commment and insert the updated
    // comment as a new comment
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) {throw err;}
        dish.comments.id(req.params.commentId).remove();
        req.body.customer = req.decoded._doc._id;
        dish.comments.push(req.body);
        dish.save(function (err, dish) {
            if (err) {throw err;}
            console.log('Updated Comments!');
            res.json(dish);
        });
    });
})

.delete(function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
         if (dish.comments.id(req.params.commentId).customer
           !== req.decoded._doc._id) {
            err = new Error('You are not authorized to perform this operation!');
            err.status = 403;
            return next(err);
        }
        dish.comments.id(req.params.commentId).remove();
        dish.save(function (err, resp) {
            if (err) {throw err;}
            res.json(resp);
        });
    });
});

module.exports = dishRouter;
