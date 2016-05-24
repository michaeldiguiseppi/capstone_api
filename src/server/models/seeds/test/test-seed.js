var db = require('../../../models/users');
var seedUser = require('../users');

module.exports.test = function (done) {
  return seedUser()
  .then(function() {
    if(done) {
      done();
    }
  });
};
