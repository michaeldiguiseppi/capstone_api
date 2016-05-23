var express = require('express');
var router = express.Router();
var Movie = require('../models/movies');
var User = require('../models/users');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var request = require('request');
if (process.env.NODE_ENV !== 'production') { var config = require('../../_config'); }


router.get('/:user_id/movies', getMovies);
router.post('/:user_id/movie/add', insertMovie);
router.get('/:user_id/streaming/:id/:type', getStreamingSources);
router.put('/:user_id/movie/:id/delete', deleteMovie);

///////////////////////////////////////////////////////////

function getMovies(req, res, next) {
  User.findById(req.params.user_id)
  .then(function(user) {
    console.log(user);
    res.status(200).json(user.movies);
  })
  .catch(function(err) {
    res.status(404).json({status: 'danger', data: 'User or Movies not found.'});
  });
}

function insertMovie(req, res, next) {
  var movie = new Movie(req.body);
  User.findById(req.params.user_id)
  .update({$addToSet: {movies: movie}})
  .then(function(user) {
    res.status(200).json(user);
  }).catch(function(err) {
    res.status(400).json({status: 'danger', data: 'Movie failed to insert.  Please try again.'});
  });
}


function getStreamingSources(req, res, next) {
  var type = req.params.type;
  var id = req.params.id;
  var baseUrl = 'https://api-public.guidebox.com/v1.43/US/' + process.env.GUIDEBOX_KEY;
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
      res.status(200).json(JSON.parse(bod));
    });
  });
}

function deleteMovie(req, res, next) {
  var query = { _id: req.params.user_id };
  var options = { new: true };

  User.findOneAndUpdate(query, { $pull: { movies: { imdbID: req.params.id }}}, {new: true})
  .then(function(data) {
    res.status(200).json({status: 'success', data: data});
  })
  .catch(function(err) {
    res.status(400).json({status: 'danger', data: err});
  });
}

module.exports = router;
