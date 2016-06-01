process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../src/server/app');
var should = chai.should();
var testUtilities = require('../utilities');
var testSeed = require('../../src/server/models/seeds/users');
var Users = require('../../src/server/models/users');

chai.use(chaiHttp);


describe('user routes', function() {

  beforeEach(function(done) {
    testUtilities.dropDatabase();
    testSeed().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    testUtilities.dropDatabase(done);
  });

  describe('/GET users/:user_id/movies', function() {
    it('should return all movies for a user', function(done) {
      Users.findOne().then(function(user) {
        chai.request(server)
          .get('/users/'+user._id+'/movies')
          .end(function(err, res) {
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.should.be.a('array');
            res.body[0].should.be.a('object');
            res.body[0].Title.should.equal('Titanic');
            res.body[0].should.have.property('Rated');
            res.body[0].Rated.should.equal('PG-13');
            res.body[0].should.have.property('Runtime');
            res.body[0].Runtime.should.equal('194 min');
            return done();
        });
      });
    });
  });
  describe('/POST users/:user_id/movie/add/collection', function() {
    it('should insert one movie', function(done) {
      Users.findOne().then(function(user) {
        chai.request(server)
          .post('/users/'+user._id+'/movie/add/collection')
          .send({
            Title: "Scarface",
            Year: "1983",
            Rated: "R",
            Released: "09 Dec 1983",
            Runtime: "170 min",
            Genre: "Crime, Drama",
            Director: "Brian De Palma",
            Writer: "Oliver Stone (screenplay)",
            Actors: "Al Pacino, Steven Bauer, Michelle Pfeiffer, Mary Elizabeth Mastrantonio",
            Plot: "In 1980 Miami, a determined Cuban immigrant takes over a drug cartel while succumbing to greed.",
            Language: "English, Spanish",
            Country: "USA",
            Awards: "Nominated for 3 Golden Globes. Another 4 nominations.",
            Poster: "http://ia.media-imdb.com/images/M/MV5BMjAzOTM4MzEwNl5BMl5BanBnXkFtZTgwMzU1OTc1MDE@._V1_SX300.jpg",
            Metascore: "65",
            imdbRating: "8.3",
            imdbVotes: "525,616",
            imdbID: "tt0086250",
            Type: "movie",
            Response: "True"
          })
          .end(function(err, res) {
            res.status.should.equal(200);
            res.body.should.be.a('object');
            res.body.movies.should.be.a('array');
            res.body.movies.length.should.equal(2);
            res.body.movies[0].should.have.property('Title');
            res.body.movies[0].Title.should.equal('Titanic');
            res.body.movies[0].should.have.property('Runtime');
            res.body.movies[0].Runtime.should.equal('194 min');
            res.body.movies[1].should.have.property('Title');
            res.body.movies[1].Title.should.equal('Scarface');
            res.body.movies[1].should.have.property('Runtime');
            res.body.movies[1].Runtime.should.equal('170 min');
            return done();
        });
      });
    });
    it('should not insert a movie with a bad user_id into the collection', function(done) {
      Users.findOne().then(function(user) {
        chai.request(server)
          .post('/users/'+user._id+'2345/movie/add/collection')
          .send({
            Title: "Scarface",
            Year: "1983",
            Rated: "R",
            Released: "09 Dec 1983",
            Runtime: "170 min",
            Genre: "Crime, Drama",
            Director: "Brian De Palma",
            Writer: "Oliver Stone (screenplay)",
            Actors: "Al Pacino, Steven Bauer, Michelle Pfeiffer, Mary Elizabeth Mastrantonio",
            Plot: "In 1980 Miami, a determined Cuban immigrant takes over a drug cartel while succumbing to greed.",
            Language: "English, Spanish",
            Country: "USA",
            Awards: "Nominated for 3 Golden Globes. Another 4 nominations.",
            Poster: "http://ia.media-imdb.com/images/M/MV5BMjAzOTM4MzEwNl5BMl5BanBnXkFtZTgwMzU1OTc1MDE@._V1_SX300.jpg",
            Metascore: "65",
            imdbRating: "8.3",
            imdbVotes: "525,616",
            imdbID: "tt0086250",
            Type: "movie",
            Response: "True"
          })
          .end(function(err, res) {
            res.status.should.equal(400);
            res.body.should.be.a('object');
            res.body.should.have.property('status');
            res.body.status.should.equal('danger');
            res.body.should.have.property('data');
            res.body.data.should.equal('Movie failed to insert.  Please try again.');
            return done();
        });
      });
    });
  });
  describe('/POST users/:user_id/movie/add/wishlist', function() {
    it('should insert one movie to the wishlist', function(done) {
      Users.findOne().then(function(user) {
        chai.request(server)
          .post('/users/'+user._id+'/movie/add/wishlist')
          .send({
            Title: "Scarface",
            Year: "1983",
            Rated: "R",
            Released: "09 Dec 1983",
            Runtime: "170 min",
            Genre: "Crime, Drama",
            Director: "Brian De Palma",
            Writer: "Oliver Stone (screenplay)",
            Actors: "Al Pacino, Steven Bauer, Michelle Pfeiffer, Mary Elizabeth Mastrantonio",
            Plot: "In 1980 Miami, a determined Cuban immigrant takes over a drug cartel while succumbing to greed.",
            Language: "English, Spanish",
            Country: "USA",
            Awards: "Nominated for 3 Golden Globes. Another 4 nominations.",
            Poster: "http://ia.media-imdb.com/images/M/MV5BMjAzOTM4MzEwNl5BMl5BanBnXkFtZTgwMzU1OTc1MDE@._V1_SX300.jpg",
            Metascore: "65",
            imdbRating: "8.3",
            imdbVotes: "525,616",
            imdbID: "tt0086250",
            Type: "movie",
            Response: "True"
          })
          .end(function(err, res) {
            res.status.should.equal(200);
            res.body.should.be.a('object');
            res.body.wishlist.should.be.a('array');
            res.body.wishlist.length.should.equal(1);
            res.body.wishlist[0].should.have.property('Title');
            res.body.wishlist[0].Title.should.equal('Scarface');
            res.body.wishlist[0].should.have.property('Runtime');
            res.body.wishlist[0].Runtime.should.equal('170 min');
            return done();
        });
      });
    });
    it('should not insert a movie with a bad user_id into the wishlist', function(done) {
      Users.findOne().then(function(user) {
        chai.request(server)
          .post('/users/'+user._id+'2345/movie/add/collection')
          .send({
            Title: "Scarface",
            Year: "1983",
            Rated: "R",
            Released: "09 Dec 1983",
            Runtime: "170 min",
            Genre: "Crime, Drama",
            Director: "Brian De Palma",
            Writer: "Oliver Stone (screenplay)",
            Actors: "Al Pacino, Steven Bauer, Michelle Pfeiffer, Mary Elizabeth Mastrantonio",
            Plot: "In 1980 Miami, a determined Cuban immigrant takes over a drug cartel while succumbing to greed.",
            Language: "English, Spanish",
            Country: "USA",
            Awards: "Nominated for 3 Golden Globes. Another 4 nominations.",
            Poster: "http://ia.media-imdb.com/images/M/MV5BMjAzOTM4MzEwNl5BMl5BanBnXkFtZTgwMzU1OTc1MDE@._V1_SX300.jpg",
            Metascore: "65",
            imdbRating: "8.3",
            imdbVotes: "525,616",
            imdbID: "tt0086250",
            Type: "movie",
            Response: "True"
          })
          .end(function(err, res) {
            res.status.should.equal(400);
            res.body.should.be.a('object');
            res.body.should.have.property('status');
            res.body.status.should.equal('danger');
            res.body.should.have.property('data');
            res.body.data.should.equal('Movie failed to insert.  Please try again.');
            return done();
        });
      });
    });
  });
  describe('/GET users/:user_id/streaming/:id/:type', function() {
    it('should return streaming sources for the specified movie', function(done) {
      this.timeout(4000);
      Users.findOne().then(function(user) {
        var movies = user.movies[0];
        chai.request(server)
          .get('/users/'+user._id+'/streaming/'+movies.imdbID+'/'+movies.Type)
          .end(function(err, res) {
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.title.should.equal('Titanic');
            res.body.should.have.property('overview');
            res.body.overview.should.be.a('string');
            res.body.should.have.property('purchase_web_sources');
            res.body.purchase_web_sources.should.be.a('array');
            res.body.purchase_web_sources.length.should.not.equal(0);
            res.body.purchase_web_sources[0].should.be.a('object');
            res.body.purchase_web_sources[0].source.should.equal('itunes');
            return done();
        });
      });
    });
  });
  describe('/PUT users/:user_id/movie/:id/delete', function() {
    it('should delete a single movie', function(done) {
      Users.findOne().then(function(user) {
        chai.request(server)
        .put('/users/'+user._id+'/movie/'+user.movies[0].imdbID+'/delete')
        .end(function(err, res) {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.equal('success');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('username');
          res.body.data.should.have.property('email');
          res.body.data.movies.should.be.a('array');
          res.body.data.movies.length.should.equal(0);
          return done();
        });
      });
    });
  });
});
