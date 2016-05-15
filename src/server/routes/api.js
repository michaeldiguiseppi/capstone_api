var express = require('express');
var router = express.Router();
var Movie = require('../models/movies');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/movies', function (req, res, next) {
  res.json({ message: 'Got movies', status: 'Success' });
});

module.exports = router;
