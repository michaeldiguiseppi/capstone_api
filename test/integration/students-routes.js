process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../src/server/app');
var should = chai.should();
var testUtilities = require('../utilities');
var testSeed = require('../../src/server/models/seeds/test-seed');
var Students = require('../../src/server/models/students');

chai.use(chaiHttp);

/*
describe('student routes', function() {

  beforeEach(function(done) {
    testUtilities.dropDatabase();
    testSeed.runSeed(done);
  });

  afterEach(function(done) {
    testUtilities.dropDatabase(done);
  });

  describe('/GET students', function() {
    it('should return all students', function(done) {
        chai.request(server)
          .get('/students')
          .end(function(err, res) {
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.data.should.be.a('array');
            res.body.should.be.a('object');
            res.body.should.have.property('status');
            res.body.status.should.equal('success');
            res.body.should.have.property('data');
            res.body.data.length.should.equal(1);
            res.body.data[0].firstName.should.equal('Kevin');
            res.body.data[0].lastName.should.equal('Schwartz');
            res.body.data[0].year.should.equal(2001);
            return done();
        });
    });
  });
  describe('/GET one student', function() {
    it('should return one student', function(done) {
      Students.findOne()
      .then(function(student){
        console.log(student);
        chai.request(server)
          .get('/students/'+student.id)
          .end(function(err, res) {
            console.log('ENDING GET ONE');
            console.log(res.body);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.should.be.a('object');
            res.body.firstName.should.equal('Kevin');
            res.body.lastName.should.equal('Schwartz');
            res.body.year.should.equal(2001);
            return done();
        });
      }).catch(function(err) {
        console.log('CATCH CLAUSE!', err);
        done();
      });
    });
  });
  describe('/POST students', function() {
    it('should insert one student', function(done) {
        chai.request(server)
          .post('/students')
          .send({
            firstName: 'Michael',
            lastName: 'DiGuiseppi',
            year: '2003'
          })
          .end(function(err, res) {
            res.status.should.equal(200);
            res.body.should.be.a('object');
            res.body.firstName.should.equal('Michael');
            res.body.lastName.should.equal('DiGuiseppi');
            res.body.year.should.equal(2003);
            return done();
        });
    });
  });
  describe('/PUT students/:id', function() {
    it('should return a single student', function(done) {
      Students.findOne().then(function(student) {
        var studentID = student._id;
        console.log(student.id, student._id);
        chai.request(server)
        .put('/students/'+studentID)
        .send({firstName: 'Tyler'})
        .end(function(err, res) {
          console.log('ENDING UPDATE ONE');
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('data');
          res.body.status.should.equal('success');
          res.body.data.should.be.a('object');
          res.body.data.firstName.should.equal('Tyler');
          res.body.data.lastName.should.equal('Schwartz');
          res.body.data.year.should.equal(2001);
          return done();
        });
      });
    });
  });
  describe('/DELETE students', function() {
    it('should delete one student', function(done) {
      Students.findOne().then(function(student) {
        chai.request(server)
          .delete('/students/'+student._id)
          .end(function(err, response) {
            chai.request(server)
              .get('/students')
              .end(function(err, res) {
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.data.should.be.a('array');
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.status.should.equal('success');
                res.body.should.have.property('data');
                res.body.data.length.should.equal(0);
                return done();
            });
        });
      });
    });
  });
}); */
