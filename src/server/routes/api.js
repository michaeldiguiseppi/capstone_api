var express = require('express');
var router = express.Router();
var Movie = require('../models/movies');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

router.get('/movies', getMovies);
router.post('/movies', addMovie);

////////////////////////////////////

function getMovies(req, res, next) {
  Movie.find().then(function (data) {
    res.json({ message: 'Got movies', status: 'Success', data: data });
  });
}

function addMovie(req, res, next) {
  var movie = new Movie(req.body);
  movie.save().then(function (data) {
    res.json({ message: 'Movie inserted.', status: 'Success', data: data });
  });
}

module.exports = router;
