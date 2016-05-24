var faker = require('faker');
var User = require('../../models/users');


module.exports = seedData;

function seedData (num) {
  var users = [];
  var toGenerate = num || 10;
  var returner = [];

  for ( var i = 0; i < toGenerate; i++ ) {
    users.push(constructUser());
    returner.push(0);
  }

  return User.collection.insert(users);
}

function constructUser () {
  var person = {};

  person.password = faker.internet.password(20);

  person.email = faker.internet.email();
  person.username = faker.internet.userName();
  if ( person.username.length < 6 ) {
    person.username += faker.lorem.word();
  }
  person.movies = [];
  person.movies.push(
    {
      Title: "Titanic",
      Year: "1997",
      Rated: "PG-13",
      Released: "19 Dec 1997",
      Runtime: "194 min",
      Genre: "Drama, Romance",
      Director: "James Cameron",
      Writer: "James Cameron",
      Actors: "Leonardo DiCaprio, Kate Winslet, Billy Zane, Kathy Bates",
      Plot: "A seventeen-year-old aristocrat falls in love with a kind, but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
      Language: "English",
      Country: "USA",
      Awards: "Won 11 Oscars. Another 109 wins & 73 nominations.",
      Poster: "http://ia.media-imdb.com/images/M/MV5BMjExNzM0NDM0N15BMl5BanBnXkFtZTcwMzkxOTUwNw@@._V1_SX300.jpg",
      Metascore: "74",
      imdbRating: "7.7",
      imdbVotes: "778,968",
      imdbID: "tt0120338",
      Type: "movie",
      Response: "True"
      });

  return person;
}
