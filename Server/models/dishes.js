/*jslint node: true */
/*jslint white:true */
/*jslint nomen:true */
/*jslint es5:true */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var commentSchema = new Schema(
    {
        rating:  {
            type: Number,
            min: 0,
            max: 5,
            required: true
        },
        comment:  {
            type: String,
            required: true
        },
        dateposted: {
            type: Date,
            required: false
        },
        customer: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
            // When posting comments the registered user is a customer
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
var dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
        default: 'assets/img/myDish.jpg'
    },
    cuisine: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    allergy: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        required: true
    },
    chef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
        // When posting a dish only the registered user can create the dish - so he is the chef
    },
    comments:[commentSchema]
}, {
    timestamps: true
});

function getPrice(num){
    return (num/100).toFixed(2);
}

function setPrice(num){
    return num*100;
}

// the schema is useless so far
// we need to create a model using it
var Dishes = mongoose.model('Dish', dishSchema);

// make this available to our Node applications
module.exports = Dishes;