var express = require('express');
var router = express.Router();
var Movie = require('../models/movies');
var User = require('../models/users');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var request = require('request');
var config = require('../../_config');


/*
  Make users routes and movies routes
    - prefix user routes with :user_id
    - movie routes can be accessed without logging in.
    - if accessing a protected route, redirect to login (this will be client-side)

    app.use('/users', userRoutes);
    /:user_id/movies/

    within here, i can have a movie route for collection

    app.use('/movies', movieRoutes);
    /movies/get
*/
router.get('/movies', getMovies);
router.get('/:upc', getTitle);
router.post('/insert', insertMovie);
router.get('/movie/:title', getMovie);
router.get('/streaming/:id/:type', getStreamingSources);
router.put('/delete/:id/:user_id', deleteMovie);

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
  var type = req.params.type;
  var id = req.params.id;
  var baseUrl = 'https://api-public.guidebox.com/v1.43/US/' + config.GUIDEBOX_KEY;
  var options;
  var second_url;
  if (type === 'movie') {
    options = {
      method: 'GET',
      url: baseUrl + '/search/movie/id/imdb/' + id,
    };
    second_url = '/movie/';
  } else {
    options = {
      method: 'GET',
      url: baseUrl + '/search/id/imdb/' + id,
    };
    second_url = '/show/';
  }
  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    var guideboxId = JSON.parse(body).id;
    var options = {
      method: 'GET',
      url: baseUrl + second_url + guideboxId,
    };

    request(options, function(err, resp, bod) {
      if (err) throw new Error(err);
      res.json(JSON.parse(bod));
    });
  });
  // 'https://api-public.guidebox.com/v1.43/US/' + config.GUIDEBOX_KEY + '/search/movie/id/imdb/' + req.params.id
}


function deleteMovie(req, res, next) {
  var query = { _id: req.params.user_id };
  var options = { new: true };

  User.findOneAndUpdate(query, { $pull: { movies: { imdbID: req.params.id }}}, {new: true})
  .then(function(data) {
    res.json({status: 'success', data: data});
  }).catch(function(err) {
    res.json({status: 'danger', data: err});
  });
}

module.exports = router;
