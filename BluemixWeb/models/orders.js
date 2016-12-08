/*jslint node: true */
/*jslint white:true */
/*jslint nomen:true */
/*jslint es5:true */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dishesorderedSchema = new Schema(
    {
        
        dish: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish'
            // When posting comments the registered user is a customer
        },
        quantity:
        {
            type: Number,
            required: true
        }
    }, 
    {
        timestamps: true
    },
    {
        $currentDate: {
            "dateposted" : true
        }
    }
);


// create a schema
var orderSchema = new Schema({
   customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
        // When posting a dish only the registered user can create the dish - so he is the chef
    },
    chef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
        // When posting a dish only the registered user can create the dish - so he is the chef
    },
    status: {
        type: String,
        required: true
    },
    dishes:[dishesorderedSchema]
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Orders = mongoose.model('Order', orderSchema);

// make this available to our Node applications
module.exports = Orders;