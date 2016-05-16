var express = require('express');
var router = express.Router();
var Movie = require('../models/movies');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/movies', function (req, res, next) {
  console.log('got here');
  Movie.find().then(function (data) {
    console.log(data);
    res.json({ message: 'Got movies', status: 'Success', data: data });
  });
});

router.post('/movies', function (req, res, next) {
  Movie.create({ title: 'Titanic', release_year: 1997, rated: 'PG-13' }).then(function () {
    res.json({ message: 'Movie inserted.', status: 'Success' });
  });
});

module.exports = router;
