var mongoose = require('mongoose');
var Users = require('../src/server/models/users');

function dropDatabase(done) {
  mongoose.connection.db.dropDatabase();
  if (done) {
    done();
  }
}

module.exports = {
  dropDatabase: dropDatabase,
};
