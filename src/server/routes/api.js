var express = require('express');
var router = express.Router();
var Movie = require('../models/movies');
var User = require('../models/users');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var request = require('request');
var config = require('../../_config');

router.get('/movies', getMovies);
router.get('/:upc', getTitle);
router.post('/insert', insertMovie);
router.get('/movie/:title', getMovie);
router.get('/streaming/:id', getStreamingSources);

////////////////////////////////////

function getMovies(req, res, next) {
  User.find({email: 'test@test.com'}).then(function(user) {
    console.log(user[0]);
    res.json(user[0].movies);
  });
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

    if (JSON.parse(body)[0]) {
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
    } else {
      res.json({status: 'Error', data: 'Something went wrong.'});
    }
  });
}

function insertMovie(req, res, next) {
  var movie = new Movie(req.body);
  User.find({email: 'test@test.com'}).update({$addToSet: {movies: movie}}).then(function(user) {
    console.log(user);
    res.json(user);
  });
  console.log(movie);
}

function getMovie(req, res, next) {
  var title = req.params.title;
  var options = {
    method: 'GET',
    url: 'http://omdbapi.com/?t=' + title,
  };
  request(options, function (err, resp, bod) {
    if (err) throw new Error(err);
    console.log(JSON.parse(bod));
    res.json(JSON.parse(bod));
  });
}

function getStreamingSources(req, res, next) {
  // 'https://api-public.guidebox.com/v1.43/US/' + config.GUIDEBOX_KEY + '/search/movie/id/imdb/' + req.params.id
}

module.exports = router;
