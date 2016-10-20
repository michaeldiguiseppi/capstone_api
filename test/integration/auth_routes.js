process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../src/server/app');
var should = chai.should();
var testUtilities = require('../utilities');
var testSeed = require('../../src/server/models/seeds/users');
var Users = require('../../src/server/models/users');

chai.use(chaiHttp);


describe('auth routes', function() {

  beforeEach(function(done) {
    testUtilities.dropDatabase();
    testSeed().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    testUtilities.dropDatabase(done);
  });

  describe('/POST auth/register', function() {
    it('should register a user', function(done) {
      chai.request(server)
        .post('/auth/register')
        .send({
          username: "MikeDee2",
          email: "mike2@gmail.com",
          password: "password",
          allow_emails: true,
        })
        .end(function(err, res) {
          res.status.should.equal(201);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.equal('success');
          res.body.should.have.property('message');
          res.body.message.should.be.a('object');
          res.body.message.should.have.property('token');
          res.body.message.should.have.property('user');
          res.body.message.user.should.be.a('object');
          res.body.message.user.should.have.property('username');
          res.body.message.user.username.should.equal('MikeDee2');
          res.body.message.user.email.should.equal('mike2@gmail.com');
          res.body.message.user.allow_emails.should.equal(true);
          return done();
        });
    });
    it('should not register a duplicate user', function(done) {
      chai.request(server)
        .post('/auth/register')
        .send({
          username: "MikeDeeGee",
          email: "mike@gmail.com",
          password: "password",
          allow_emails: true,
        })
        .end(function(err, res) {
          res.status.should.equal(409);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.equal('danger');
          res.body.should.have.property('message');
          res.body.message.should.be.a('string');
          return done();
        });
      });
      it('should not register a user if there is missing information', function(done) {
        chai.request(server)
          .post('/auth/register')
          .send({
            username: "MikeDee",
            email: "mike2@gmail.com",
            allow_emails: true,
          })
          .end(function(err, res) {
            res.status.should.equal(422);
            res.type.should.equal('application/json');
            res.body.should.be.a('object');
            res.body.should.have.property('status');
            res.body.status.should.equal('danger');
            res.body.should.have.property('message');
            res.body.message.should.be.a('object');
            return done();
          });
        });
    });
  describe('/POST auth/login', function() {
    it('should log in a user', function(done) {
      chai.request(server)
        .post('/auth/login')
        .send({
          email: 'mike@gmail.com',
          password: 'password',
        })
        .end(function(err, res) {
          res.status.should.equal(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.equal('success');
          res.body.should.have.property('message');
          res.body.message.should.be.a('object');
          res.body.message.should.have.property('token');
          res.body.message.should.have.property('user');
          res.body.message.user.should.be.a('object');
          res.body.message.user.should.have.property('username');
          res.body.message.user.username.should.equal('MikeDeeGee');
          res.body.message.user.should.have.property('email');
          res.body.message.user.email.should.equal('mike@gmail.com');
          return done();
      });
    });
    it('should not log in a user if the password is missing', function(done) {
      chai.request(server)
        .post('/auth/login')
        .send({
          email: 'mike@gmail.com',
        })
        .end(function(err, res) {
          res.status.should.equal(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.equal('danger');
          res.body.should.have.property('message');
          res.body.message.should.equal('Missing password.');
          res.body.should.have.property('requestBody');
          res.body.requestBody.should.be.a('object');
          res.body.requestBody.should.have.property('email');
          res.body.requestBody.email.should.equal('mike@gmail.com');
          return done();
      });
    });
    it('should not log in a user if the password is wrong', function(done) {
      chai.request(server)
        .post('/auth/login')
        .send({
          email: 'mike@gmail.com',
          password: 'password23',
        })
        .end(function(err, res) {
          res.status.should.equal(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.equal('danger');
          res.body.should.have.property('message');
          res.body.message.should.equal('Password is not correct');
          res.body.should.have.property('requestBody');
          res.body.requestBody.should.be.a('object');
          res.body.requestBody.should.have.property('email');
          res.body.requestBody.email.should.equal('mike@gmail.com');
          res.body.requestBody.should.have.property('password');
          res.body.requestBody.password.should.equal('password23');
          return done();
      });
    });
    it('should not log in a user if the email does not exist', function(done) {
      chai.request(server)
        .post('/auth/login')
        .send({
          email: 'mike27@gmail.com',
          password: 'password',
        })
        .end(function(err, res) {
          res.status.should.equal(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.equal('danger');
          res.body.should.have.property('message');
          res.body.message.should.equal('User does not exist');
          res.body.should.have.property('requestBody');
          res.body.requestBody.should.be.a('object');
          res.body.requestBody.should.have.property('email');
          res.body.requestBody.email.should.equal('mike27@gmail.com');
          res.body.requestBody.should.have.property('password');
          res.body.requestBody.password.should.equal('password');
          return done();
      });
    });
  });
  describe('/PUT auth/update_password', function() {
    it('should change the password of a user', function(done) {
      chai.request(server)
        .put('/auth/update_password')
        .send({
          email: 'mike@gmail.com',
          old_password: 'password',
          new_password: 'password2'
        })
        .end(function(err, res) {
          res.status.should.equal(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.equal('success');
          res.body.should.have.property('message');
          res.body.message.should.be.a('string');
          res.body.message.should.equal('Password updated successfully.');
          return done();
      });
    });
    it('should not update the password if the user fails to provide a new password', function(done) {
      chai.request(server)
        .put('/auth/update_password')
        .send({
          email: 'mike@gmail.com',
          old_password: 'password',
        })
        .end(function(err, res) {
          res.status.should.equal(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.equal('danger');
          res.body.should.have.property('message');
          res.body.message.should.equal('Missing new password.');
          res.body.should.have.property('requestBody');
          res.body.requestBody.should.be.a('object');
          res.body.requestBody.should.have.property('email');
          res.body.requestBody.email.should.equal('mike@gmail.com');
          res.body.requestBody.should.have.property('old_password');
          res.body.requestBody.old_password.should.equal('password');
          return done();
      });
    });
    it('should not update the password if a user fails to provide the correct old password', function(done) {
      chai.request(server)
        .put('/auth/update_password')
        .send({
          email: 'mike@gmail.com',
          new_password: 'password23',
          old_password: 'password22'
        })
        .end(function(err, res) {
          res.status.should.equal(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.equal('danger');
          res.body.should.have.property('message');
          res.body.message.should.equal('Old password is not correct');
          res.body.should.have.property('requestBody');
          res.body.requestBody.should.be.a('object');
          res.body.requestBody.should.have.property('email');
          res.body.requestBody.email.should.equal('mike@gmail.com');
          res.body.requestBody.should.have.property('new_password');
          res.body.requestBody.new_password.should.equal('password23');
          res.body.requestBody.should.have.property('old_password');
          res.body.requestBody.old_password.should.equal('password22')
          return done();
      });
    });
    it('should not log in a user if the email does not exist', function(done) {
      chai.request(server)
        .post('/auth/login')
        .send({
          email: 'mike27@gmail.com',
          password: 'password',
        })
        .end(function(err, res) {
          res.status.should.equal(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.status.should.equal('danger');
          res.body.should.have.property('message');
          res.body.message.should.equal('User does not exist');
          res.body.should.have.property('requestBody');
          res.body.requestBody.should.be.a('object');
          res.body.requestBody.should.have.property('email');
          res.body.requestBody.email.should.equal('mike27@gmail.com');
          res.body.requestBody.should.have.property('password');
          res.body.requestBody.password.should.equal('password');
          return done();
      });
    });
  });
});
