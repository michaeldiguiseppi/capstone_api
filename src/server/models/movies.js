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
  runtime: {
    type: String,
  },
  genre: {
    type: String,
  },
  director: {
    type: String,
  },
  writer: {
    type: String,
  },
  actors: {
    type: String,
  },
  poster: {
    type: String,
  },
  imdbId: {
    type: String,
  },
  imdbRating: {
    type: String,
  },
});

var Movie = mongoose.model('movies', MovieSchema);

module.exports = Movie;
