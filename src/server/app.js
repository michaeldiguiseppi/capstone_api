// *** main dependencies *** //
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
if (!process.env.NODE_ENV) {
  require('dotenv').config({silent: true});
}
var config = require('../_config');

// *** routes *** //
var routes = require('./routes/index.js');
var apiRoutes = require('./routes/api.js');
var authRoutes = require('./routes/auth.js');
var movieRoutes = require('./routes/movies.js');
var userRoutes = require('./routes/users.js');

var mongoURI = config.mongoURI[process.env.NODE_ENV || 'development'];
// *** express instance *** //
var app = express();

mongoose.connect(mongoURI, function (err, res) {
  if (err) {
    console.log('Error connecting to the database. ' + err);
  }
});

// *** config middleware *** //
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../docs')));

// *** allow for front-end requests *** //
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, api_key, Authorization, Accept, *");
  next();
});

// *** main routes *** //
app.use('/', routes);
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/movies', movieRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// *** error handlers *** //

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {},
  });
});

module.exports = app;
