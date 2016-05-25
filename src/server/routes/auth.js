var express = require('express');
var router = express.Router();
var User = require('../models/users');
var moment = require('moment');
var jwt = require('jwt-simple');

router.post('/register', registerUser);
router.post('/login', loginUser);

////////////////////////////////////////////

function registerUser (req, res, next) {
  // ensure user does not already exist
  User.find({email: req.body.email}).then(function(data) {
    if (data.length) {
      res.status(409)
        .json({
          status: 'danger',
          message: 'User already exists. Please log in or register a different user.'
        });
    } else {
      User.create(req.body)
        .then(function (member) {
          var token = generateToken(member);
          return Promise.resolve({
            token: token,
            user: member
          });
        })
        .then(function(data) {
          res.status(201).json({
            status: 'success',
            message: data
          });
        })
        .catch(function(err) {
          res.status(422).json({
            status: 'danger',
            message: err
          });
        });
    }
  }).catch(function(err) {
    res.status(400).json({
      status: 'danger',
      message: err,
    })
  });
}

 function loginUser (req, res, next) {
  // ensure that user exists
  User.findOne({email: req.body.email})
  .then(function (user) {
    if (!user) {
      return res.status(401).json({
        status: 'danger',
        message: 'User does not exist',
        requestBody: req.body
      });
    } else
      if ( !req.body.password ) {
        return res.status(401).json({
          status: 'danger',
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
            status: 'danger',
            message: 'Password is not correct',
            requestBody: req.body
          });
        }
      user = user.toObject();
      delete user.password;
      var token = generateToken(user);
      res.status(200).json({
        status: 'success',
        message: {
          token: token,
          user: user
        }
      });
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

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
