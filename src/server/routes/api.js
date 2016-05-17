var express = require('express');
var router = express.Router();
var Movie = require('../models/movies');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var request = require('request');

router.get('/movies', getMovies);
router.post('/movies', addMovie);
router.get('/:upc', getTitle);

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

function getTitle(req, res, next) {
  var upc = req.params.upc;
  var options = {
    method: 'GET',
    url: 'http://localhost:5001/api/' + upc,
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    var title = JSON.parse(body)[0].DVD_Title.split('(')[0];
    var options = {
      method: 'GET',
      url: 'http://omdbapi.com/?t=' + title,
    };
    request(options, function (err, resp, bod) {
      if (err) throw new Error(err);
      console.log(JSON.parse(bod));
      res.json(JSON.parse(bod));
    });
  });
}

module.exports = router;
