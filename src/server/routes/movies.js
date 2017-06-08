var express = require('express');
var router = express.Router();
var Movie = require('../models/movies');
var User = require('../models/users');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var request = require('request');

router.get('/:upc', getTitle);
router.get('/find/:title', getMovie);
router.get('/related/:id/:type', getRelated);

////////////////////////////////////////

function getTitle(req, res, next) {
  var upc = req.params.upc;
  var options = {
    method: 'GET',
    url: 'http://mmdb-upc.herokuapp.com/api/' + upc,
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    if (JSON.parse(body)[0]) {
      var title = JSON.parse(body)[0].DVD_Title.split('(')[0];
      var options = {
        method: 'GET',
        url: 'http://omdbapi.com/?t=' + title + '&apikey=' + process.env.API_KEY,
      };
      request(options, function (err, resp, bod) {
        if (err) throw new Error(err);
        res.status(200).json(JSON.parse(bod));
      });
    } else {
      res.status(400).json({status: 'danger', data: 'Something went wrong. Please try again.'});
    }
  });
}

function getMovie(req, res, next) {
  var title = req.params.title;
  var options = {
    method: 'GET',
    url: 'http://omdbapi.com/?t=' + title + '&apikey=' + process.env.API_KEY,
  };
  request(options, function (err, resp, bod) {
    if (err) throw new Error(err);
    if (JSON.parse(bod).Title) {
      res.status(200).json(JSON.parse(bod));
    } else {
      res.status(400).json({
        status: 'danger',
        data: 'Invalid title.  Please try again.'
      });
    }

  });
}

function getRelated(req, res, next) {
  var id = req.params.id;
  var type = req.params.type;
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
      url: baseUrl + second_url + guideboxId + '/related',
    };

    request(options, function(err, resp, bod) {
      if (err) throw new Error(err);
      if (JSON.parse(bod).total_results) {
        res.status(200).json(JSON.parse(bod));
      } else {
        res.status(400).json({
          status: 'danger',
          data: 'Invalid ID.  Please try again.',
        });
      }

    });
  });
}

module.exports = router;
