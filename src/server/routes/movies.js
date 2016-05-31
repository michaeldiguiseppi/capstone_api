var express = require('express');
var router = express.Router();
var Movie = require('../models/movies');
var User = require('../models/users');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var request = require('request');

router.get('/:upc', getTitle);
router.get('/find/:title', getMovie);
router.get('/:id/related', getRelated);

////////////////////////////////////////

function getTitle(req, res, next) {
  var upc = req.params.upc;
  var options = {
    method: 'GET',
    url: 'http://movie_api.mikedee.xyz/api/' + upc,
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    if (JSON.parse(body)[0]) {
      var title = JSON.parse(body)[0].DVD_Title.split('(')[0];
      var options = {
        method: 'GET',
        url: 'http://omdbapi.com/?t=' + title,
      };
      request(options, function (err, resp, bod) {
        if (err) throw new Error(err);
        res.status(200).json(JSON.parse(bod));
      });
    } else {
      res.status(400).json({status: 'danger', message: 'Something went wrong. Please try again.'});
    }
  });
}

function getMovie(req, res, next) {
  var title = req.params.title;
  var options = {
    method: 'GET',
    url: 'http://omdbapi.com/?t=' + title,
  };
  request(options, function (err, resp, bod) {
    if (err) throw new Error(err);
    if (JSON.parse(bod).Title) {
      res.status(200).json(JSON.parse(bod));
    } else {
      res.status(400).json({
        status: 'danger',
        message: 'Invalid title.  Please try again.'
      });
    }

  });
}

function getRelated(req, res, next) {
  var id = req.params.id;
  var baseUrl = 'https://api-public.guidebox.com/v1.43/US/' + process.env.GUIDEBOX_KEY;
  console.log(process.env.GUIDEBOX_KEY);
  var options = {
    method: 'GET',
    url: baseUrl + '/movie/' + id + '/related'
  };
  request(options, function(err, resp, body) {
    if (err) throw new Error(err);
    console.log(body);
    res.status(200).json(JSON.parse(body));
  });
}

module.exports = router;
