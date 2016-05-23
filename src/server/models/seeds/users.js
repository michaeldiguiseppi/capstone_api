var faker = require('faker');
var User = require('../models/users');

module.exports = seedData;

function seedData (num) {
  var users = [];
  var toGenerate = num || 10;

  for ( var i = 0; i < toGenerate; i++ ) {
    users.push(constructUser());
  }

  return User.collection.insert(users);
}

function constructUser () {
  var person = faker.helpers.contextualCard();
  delete person.name;

  person.password = faker.internet.password(20);

  person.email = person.email;
  person.username = person.username.toLowerCase() + faker.random.number(10000);
  if ( person.username.length < 6 ) {
    person.username += faker.lorem.word();
  }
  
  return person;
}
