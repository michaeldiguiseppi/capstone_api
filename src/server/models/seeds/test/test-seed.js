var db = require('../../../models/users');
var seedUser = require('../users');

module.exports.test = function (done) {
  seedUser(5)
  .then(function() {
    if(done) {
      done();
    }
  });
};
