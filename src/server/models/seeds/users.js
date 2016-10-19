var faker = require('faker');
var User = require('../../models/users');


module.exports = seedData;

function seedData () {
  var user = new User(
    {
    	"username" : "MikeDeeGee",
    	"email" : "mike@gmail.com",
      "password": "password",
      "allow_emails": true,
    	"movies" : [{
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
      }],
      "wishlist": [{
        Title: "How to Train Your Dragon",
        Year: "2010",
        Rated: "PG",
        Released: "26 Mar 2010",
        Runtime: "98 min",
        Genre: "Animation, Adventure, Family",
        Director: "Dean DeBlois, Chris Sanders",
        Writer: "William Davies (screenplay), Dean DeBlois (screenplay), Chris Sanders (screenplay), Cressida Cowell (book)",
        Actors: "Jay Baruchel, Gerard Butler, Craig Ferguson, America Ferrera",
        Plot: "A hapless young Viking who aspires to hunt dragons, becomes the unlikely friend of a young dragon himself, and learns there may be more to the creatures than he assumed.",
        Language: "English",
        Country: "USA",
        Awards: "Nominated for 2 Oscars. Another 25 wins & 58 nominations.",
        Poster: "http://ia.media-imdb.com/images/M/MV5BMjA5NDQyMjc2NF5BMl5BanBnXkFtZTcwMjg5ODcyMw@@._V1_SX300.jpg",
        Metascore: "74",
        imdbRating: "8.2",
        imdbVotes: "474,005",
        imdbID: "tt0892769",
        Type: "movie",
        Response: "True"
      }]
    });
  return user.save();
}
