var express = require('express');
var router = express.Router();
var User = require('../models/users');
var moment = require('moment');
var jwt = require('jwt-simple');
var Promise = require('bluebird');

router.post('/register', function(req, res, next) {
  // ensure user does not already exist
  User.create(req.body)
    .then(function (member) {
      var token = generateToken(member);
      return Promise.resolve({
        token: token,
        data: member
      });
    })
    .then(handlers.success(res, 201))
    .catch(handlers.error(res, 422));
});

router.post('/login', function (req, res, next) {
  // ensure that user exists
  User.findOne({email: req.body.email})
  .then(function (user) {
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Email does not exist',
        requestBody: req.body
      });
    } else
      if ( !req.body.password ) {
        return res.status(401),json({
          status: 'fail',
          message: 'Missing password.',
          requestBody: req.body
        });
      }
      user.comparePassword(req.body.password, function (err, match) {
        if (err) {
          return next(err);
        }
        if (!match) {
          return res.status(401).json({
            status: 'fail',
            message: 'Password is not correct',
            requestBody: req.body
          });
        }
      user = user.toObject();
      delete user.password;
      var token = generateToken(user);
      res.status(200).json({
        status: 'success',
        data: {
          token: token,
          user: user
        }
      });
    });
  })
  .catch(function (err) {
    return next(err);
  });
});

// ** helpers ** //

// generate a token
function generateToken(user) {
  var payload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: user._id
  };
  return jwt.encode(payload, '\x07q\xa1\xb0\xa0\xa7x\xda\xb2\xa9+g|\xd5\x9d\xd9\x9f\x12\xc4-I\x12Q\xfc');
}

// ensure authenticated
function ensureAuthenticated(req, res, next) {
  // check headers for the presence of an auth object
  if(!(req.headers && req.headers.authorization)) {
    return res.status(400).json({
      status: 'fail',
      message: 'No header present or no authorization header.'
    });
  }
  // decode the token
  var header = req.headers.authorization.split(' ');
  var token = header[1];
  var payload = jwt.decode(token, '\x07q\xa1\xb0\xa0\xa7x\xda\xb2\xa9+g|\xd5\x9d\xd9\x9f\x12\xc4-I\x12Q\xfc');
  var now = moment().unix();
  // ensure that it is valid
  if(now > payload.exp || payload.iat > now) {
    return res.status(401).json({
      status: 'fail',
      message: 'Token is invalid'
    });
  }
  // ensure user is still in the database
  User.findById(payload.sub, function(err, user){
    if(err) {
      return next(err);
    }
    if(!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'User does not exist'
      });
    }
    // attach user to request object
    req.user = user;
    // call next middleware function
    next();
  });
}

// ensure admin
function ensureAdmin(req, res, next) {
  // check for the user object
  // check for admin === true on user object
  if(!(req.user && req.user.admin)) {
    return res.status(401).json({
      status: 'fail',
      message: 'User is not authorized'
    });
  }
  next();
}

module.exports = router;
