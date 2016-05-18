var express = require('express');
var router = express.Router();
var Movie = require('../models/movies');
var User = require('../models/users');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var request = require('request');

router.get('/movies', getMovies);
router.post('/movies', addMovie);
router.get('/:upc', getTitle);
router.post('/insert', insertMovie);

////////////////////////////////////

function getMovies(req, res, next) {

}

function addMovie(req, res, next) {
  var movie = new Movie(req.body);
}

function getTitle(req, res, next) {
  var upc = req.params.upc;
  var options = {
    method: 'GET',
    url: 'http://movie_api.mikedee.xyz/api/' + upc,
  };
  request(options, function (error, response, body) {
    console.log(body);
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

function insertMovie(req, res, next) {
  var movie = new Movie(req.body);
  User.find({email: 'test@test.com'}).update({$addToSet: {movies: movie}}).then(function(user) {
    console.log(user);
  });
  console.log(movie);
}

module.exports = router;
