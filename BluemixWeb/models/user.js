/*jslint node: true */
/*jslint white:true */
/*jslint nomen:true */
/*jslint es5:true */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: 
    {
        type: String,
        required: true
    },
    emailid: 
    {
        type: String,
        required: true
    }, 
    password: 
    {
        type: String,
        required: true
    },
    firstname: 
    {
        type: String,
        required: true
    },
    lastname:
    {
        type: String,
        required: true
    },
    location:
    {
        type: String,
        required: true
    },
    phone:
    {
        type: String,
        required: true
    },
    chef:   {
        type: Boolean,
        default: true
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);