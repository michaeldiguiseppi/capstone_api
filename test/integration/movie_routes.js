process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../src/server/app');
var should = chai.should();
var testUtilities = require('../utilities');
var testSeed = require('../../src/server/models/seeds/users');
var Users = require('../../src/server/models/users');

chai.use(chaiHttp);


describe('movie routes', function() {

  beforeEach(function(done) {
    testUtilities.dropDatabase();
    testSeed().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    testUtilities.dropDatabase(done);
  });

  describe('/get movies/:upc', function() {
    it('should get a movie by upc', function(done) {
      chai.request(server)
        .get('/movies/097361468143')
        .end(function(err, res) {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('Title');
          res.body.Title.should.equal('Titanic');
          res.body.should.have.property('Rated');
          res.body.Rated.should.equal('PG-13');
          res.body.should.have.property('Year');
          res.body.Year.should.equal('1997');
          res.body.should.have.property('Runtime');
          res.body.Runtime.should.equal('194 min');
          res.body.should.have.property('Type');
          res.body.Type.should.equal('movie');
          return done();
        });
      });
      it('should not get a movie with an invalid upc', function(done) {
        chai.request(server)
          .get('/movies/0973614681')
          .end(function(err, res) {
            res.status.should.equal(400);
            res.type.should.equal('application/json');
            res.body.should.be.a('object');
            res.body.should.have.property('status');
            res.body.status.should.equal('danger');
            res.body.should.have.property('data');
            res.body.data.should.equal('Something went wrong. Please try again.');
            return done();
          });
      });
  });
  describe('/get movies/find/:title', function() {
    it('should get a movie by title', function(done) {
      chai.request(server)
        .get('/movies/find/Titanic')
        .end(function(err, res) {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('Title');
          res.body.Title.should.equal('Titanic');
          res.body.should.have.property('Rated');
          res.body.Rated.should.equal('PG-13');
          res.body.should.have.property('Year');
          res.body.Year.should.equal('1997');
          res.body.should.have.property('Runtime');
          res.body.Runtime.should.equal('194 min');
          res.body.should.have.property('Type');
          res.body.Type.should.equal('movie');
          return done();
        });
      });
      it('should not get a movie with an invalid title', function(done) {
        chai.request(server)
          .get('/movies/find/Titanicaasaaaa')
          .end(function(err, res) {
            res.status.should.equal(400);
            res.type.should.equal('application/json');
            res.body.should.be.a('object');
            res.body.should.have.property('status');
            res.body.status.should.equal('danger');
            res.body.should.have.property('data');
            res.body.data.should.equal('Invalid title.  Please try again.');
            return done();
          });
      });
  });
  describe('/get movies/related/:id/:type', function() {
    it('should get related movies by id', function(done) {
      chai.request(server)
        .get('/movies/related/tt0120338/movie')
        .end(function(err, res) {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('total_results');
          res.body.total_results.should.equal(25);
          res.body.should.have.property('results');
          res.body.results.should.be.a('array');
          res.body.results.length.should.equal(25);
          res.body.results[0].should.be.a('object');
          res.body.results[0].title.should.equal('Forrest Gump');
          return done();
        });
      });
      it('should not get a movie with an invalid id', function(done) {
        chai.request(server)
          .get('/movies/related/tt012033833333/movie')
          .end(function(err, res) {
            res.status.should.equal(400);
            res.type.should.equal('application/json');
            res.body.should.be.a('object');
            res.body.should.have.property('data');
            res.body.data.should.equal('Invalid ID.  Please try again.');
            res.body.should.have.property('status');
            res.body.status.should.equal('danger');
            return done();
          });
      });
  });
});
