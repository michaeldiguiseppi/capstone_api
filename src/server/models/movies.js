
function Movie (body) {
  this.Title = body.Title;
  this.Year = body.Year;
  this.Rated = body.Rated;
  this.Released = body.Released;
  this.Runtime = body.Runtime;
  this.Genre = body.Genre;
  this.Director = body.Director;
  this.Writer = body.Writer;
  this.Actors = body.Actors;
  this.Plot = body.Plot;
  this.Language = body.Language;
  this.Country = body.Country;
  this.Awards = body.Awards;
  this.Poster = body.Poster;
  this.Metascore = body.Metascore;
  this.imdbRating = body.imdbRating;
  this.imdbVotes = body.imdbVotes;
  this.imdbID = body.imdbID;
  this.Type = body.Type;
  this.Response = body.Response;
}

module.exports = Movie;
