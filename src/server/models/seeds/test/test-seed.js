var db = require('../../../models/users');
var seedUser = require('../users');

module.exports.test = function (done) {
  seedUser()
  .then(function() {
    if(done) {
      return done();
    }
  });
};
