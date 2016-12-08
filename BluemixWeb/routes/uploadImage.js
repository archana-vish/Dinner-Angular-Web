/*jslint node: true */
/*jslint white:true */
/*jslint nomen:true */
/*jslint es5:true */
/*jslint node: true */
/*jslint white:true */
/*jslint nomen:true */
/*jslint es5:true */

'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');

var uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../uploads/dishes')
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    var newfilename = file.originalname.split('.')[0] + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
    console.log('newfilename : ' + newfilename);
    cb(null, file.originalname.split('.')[0] + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    //cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ storage: storage }).single('file');

var uploadFile = function() {
      console.log('did it!!');
     /* upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             console.log(res.newfilename);
             res.json({error_code:0,err_desc:null});
        }) */
};
