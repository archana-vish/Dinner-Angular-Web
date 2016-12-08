/*jslint node: true */
/*jslint white:true */
/*jslint nomen:true */
/*jslint es5:true */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var menuSchema = new Schema({
    chef:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    dishes: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Menu = mongoose.model('Menu', menuSchema);

// make this available to our Node applications
module.exports = Menu;