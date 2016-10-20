var express = require('express');
var router = express.Router();
var User = require('../models/users');
var moment = require('moment');
var jwt = require('jwt-simple');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update_password', updatePassword);

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
            message: {
              token: data.token,
              user: data.user
            }
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
    });
  });
}

 function loginUser (req, res, next) {
  // ensure that user exists
  User.findOne({ email: req.body.email.toLowerCase()})
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
      // check that the password is correct
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
      // update the user's last_login_date if successful login
      User.findOneAndUpdate({email: user.email}, { $set: {"last_login_date": Date.now() }}, {new: true})
      .then(function(user) {
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
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

function updatePassword (req, res, next) {
  User.findOne({email: req.body.email})
  .then(function(user) {
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
    user.password = req.body.password;

    user.save()
    .then(function() {
      res.status(200).json({
        status: 'success',
        message: 'Password updated successfully.'
      });
    })
    .catch(function(err) {
      return next(err);
    });
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


module.exports = router;
