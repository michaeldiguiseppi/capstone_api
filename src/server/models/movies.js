var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
  Title: {
    type: String,
    required: true,
  },
  Year: {
    type: String,
  },
  Rated: {
    type: String,
  },
  Released: {
    type: String,
  },
  Runtime: {
    type: String,
  },
  Genre: {
    type: String,
  },
  Director: {
    type: String,
  },
  Writer: {
    type: String,
  },
  Actors: {
    type: String,
  },
  Plot: {
    type: String,
  },
  Language: {
    type: String,
  },
  Country: {
    type: String,
  },
  Awards: {
    type: String,
  },
  Poster: {
    type: String,
  },
  Metascore: {
    type: String,
  },
  imdbRating: {
    type: String,
  },
  imdbVotes: {
    type: String,
  },
  imdbID: {
    type: String,
  },
  Type: {
    type: String,
  },
  Response: {
    type: String,
  },
});

var Movie = mongoose.model('movies', MovieSchema);

module.exports = Movie;
