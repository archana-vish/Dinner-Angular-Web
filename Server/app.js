/*jslint node: true */
/*jslint white:true */
/*jslint nomen:true */
/*jslint es5:true */

'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');



// Connect to Mongoose
var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));



db.once('open', function () {
  
    // we're connected!
    console.log("Connected correctly to server");
});


//var routes = require('./routes/index');
var userRouter = require('./routes/userRouter');
var dishRouter = require('./routes/dishRouter');
var menuRouter = require('./routes/menuRouter');
var orderRouter = require('./routes/orderRouter');
var uploadRouter = require('./routes/uploadRouter');


var app = express();


app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "https://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
});

// Secure traffic only
app.all('*', function(req, res, next){
  if (req.secure) {
    return next();
  };

 res.redirect('https://'+req.hostname+':'+app.get('secPort')+req.url);
}); 


var newfilename = "";
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.uploadPath)
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    newfilename = file.originalname.split('.')[0] + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
    console.log('newfilename now is : ' + newfilename);
    cb(null, newfilename)
    //cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ storage: storage }).single('file');


app.post('/dishes/upload', function(req, res) {
       console.log('Am gonna cry now');
       console.log('req ' + req);
       console.log('req.file :: ' + req.file);
       //upload.single(req.file);
       upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            console.log('newfilename :: ' + newfilename);
            res.json({filename: newfilename,error_code:0,err_desc:null});
        }) 

});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// passport config
var User = require('./models/user');
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', dishRouter);
app.use('/users', userRouter);
app.use('/dishes',dishRouter);
app.use('/menu', menuRouter);
app.use('/orders', orderRouter);
//app.use('/image/upload', uploadRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render({
    message: err.message,
    error: {}
  });
});

module.exports = app;