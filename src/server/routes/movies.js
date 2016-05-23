var express = require('express');
var router = express.Router();
var Movie = require('../models/movies');
var User = require('../models/users');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var request = require('request');

router.get('/:upc', getTitle);
router.get('/find/:title', getMovie);

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
      res.status(400).json({status: 'danger', data: 'Something went wrong. Please try again.'});
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
    res.status(200).json(JSON.parse(bod));
  });
}

module.exports = router;
