var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  release_year: {
    type: Number,
    required: true,
  },
  rated: {
    type: String,
    required: true,
  },
});

var Movie = mongoose.model('movies', MovieSchema);

module.exports = Movie;
