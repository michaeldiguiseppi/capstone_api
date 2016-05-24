var express = require('express');
var router = express.Router();
var Movie = require('../models/movies');
var User = require('../models/users');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var request = require('request');
if (process.env.NODE_ENV !== 'production') { var config = require('../../_config'); }


router.get('/:user_id/movies', getMovies);
router.post('/:user_id/movie/add', insertMovie);
router.get('/:user_id/streaming/:id/:type', getStreamingSources);
router.put('/:user_id/movie/:id/delete', deleteMovie);

///////////////////////////////////////////////////////////

function getMovies(req, res, next) {
  User.findById(req.params.user_id)
  .then(function(user) {
    res.status(200).json(user.movies);
  })
  .catch(function(err) {
    res.status(404).json({status: 'danger', data: 'User or Movies not found.'});
  });
}

function insertMovie(req, res, next) {
  var movie = new Movie(req.body);
  User.findByIdAndUpdate(req.params.user_id, {$addToSet: {movies: movie}}, {new: true})
  .then(function(user) {
    res.status(200).json(user);
  }).catch(function(err) {
    res.status(400).json({status: 'danger', data: 'Movie failed to insert.  Please try again.'});
  });
}


function getStreamingSources(req, res, next) {
  if (process.env.NODE_ENV === 'test') { res.json(
    { id: 36647,
      title: 'Titanic',
      release_year: 1997,
      themoviedb: 597,
      original_title: 'Titanic',
      alternate_titles:
       [ 'The Ship of Dreams',
         'Titanic (Digitally Remastered)',
         'Titanic 1997' ],
      imdb: 'tt0120338',
      pre_order: false,
      in_theaters: false,
      release_date: '1997-11-18',
      rating: 'PG-13',
      rottentomatoes: 22494,
      freebase: '/m/0dr_4',
      wikipedia_id: 52371,
      metacritic: 'http://www.metacritic.com/movie/titanic',
      common_sense_media: null,
      overview: '84 years later, a 101-year-old woman named Rose DeWitt Bukater tells the story to her granddaughter Lizzy Calvert, Brock Lovett, Lewis Bodine, Bobby Buell and Anatoly Mikailavich on the Keldysh about her life set in April 10th 1912, on a ship called Titanic when young Rose boards the departing ship with the upper-class passengers and her mother, Ruth DeWitt Bukater, and her fiancé, Caledon Hockley. Meanwhile, a drifter and artist named Jack Dawson and his best friend Fabrizio De Rossi win third-class tickets to the ship in a game. And she explains the whole story from departure until the death of Titanic on its first and last voyage April 15th, 1912 at 2:20 in the morning.',
      poster_120x171: 'http://static-api.guidebox.com/thumbnails_movies_small/36647-5530715389-9806926208-146575030-small-120x171.jpg',
      poster_240x342: 'http://static-api.guidebox.com/thumbnails_movies_medium/36647-5152182430-4479204742-1523742560-medium-240x342.jpg',
      poster_400x570: 'http://static-api.guidebox.com/thumbnails_movies/36647-1897279062-6353633636-1074108887-large-400x570.jpg',
      social:
       { facebook:
          { facebook_id: 216410885045047,
            link: 'https://www.facebook.com/TitanicMovie' } },
      genres: [ { id: 9, title: 'Drama' }, { id: 20, title: 'Romance' } ],
      tags:
       [ { id: 2426, tag: 'ship' },
         { id: 3305, tag: 'titanic' },
         { id: 1186, tag: 'love' },
         { id: 5350, tag: 'artist' },
         { id: 8079, tag: 'diamond' } ],
      duration: 11640,
      trailers: { web: [ [Object] ], ios: [ [Object] ], android: [ [Object] ] },
      writers: [ { id: 419012, name: 'James Cameron' } ],
      directors: [ { id: 419012, name: 'James Cameron' } ],
      cast:
       [ { id: 197698,
           name: 'Kate Winslet',
           character_name: 'Rose DeWitt Bukater' },
         { id: 35942,
           name: 'Leonardo DiCaprio',
           character_name: 'Jack Dawson' },
         { id: 126806,
           name: 'Frances Fisher',
           character_name: 'Ruth Dewitt Bukater' },
         { id: 44054,
           name: 'Billy Zane',
           character_name: 'Caledon \'Cal\' Hockley' },
         { id: 491465,
           name: 'Kathy Bates',
           character_name: 'Molly Brown' },
         { id: 633773, name: 'Gloria Stuart', character_name: 'Old Rose' },
         { id: 101919,
           name: 'Bill Paxton',
           character_name: 'Brock Lovett' },
         { id: 643523,
           name: 'Bernard Hill',
           character_name: 'Captain Edward James Smith' },
         { id: 622044,
           name: 'David Warner',
           character_name: 'Spicer Lovejoy' },
         { id: 523137,
           name: 'Victor Garber',
           character_name: 'Thomas Andrews' },
         { id: 105599,
           name: 'Jonathan Hyde',
           character_name: 'Bruce Ismay' },
         { id: 391327,
           name: 'Suzy Amis',
           character_name: 'Lizzy Calvert' },
         { id: 338057,
           name: 'Lewis Abernathy',
           character_name: 'Lewis Bodine' },
         { id: 451448,
           name: 'Nicholas Cascone',
           character_name: 'Bobby Buell' },
         { id: 126829, name: 'Danny Nucci', character_name: 'Fabrizio' },
         { id: 640183, name: 'Jason Barry', character_name: 'Tommy Ryan' },
         { id: 27611,
           name: 'Lew Palter',
           character_name: 'Isidor Strauss' },
         { id: 391405,
           name: 'Eric Braeden',
           character_name: 'John Jacob Astor IV' },
         { id: 287772,
           name: 'Bernard Fox',
           character_name: 'Col. Archibald Gracie' },
         { id: 349582,
           name: 'Ewan Stewart',
           character_name: '1st Officer Murdoch' },
         { id: 230146,
           name: 'Ioan Gruffudd',
           character_name: '5th Officer Harold Lowe' },
         { id: 391406,
           name: 'Jonathan Phillips',
           character_name: '2nd Officer Lightoller' },
         { id: 98265,
           name: 'Edward Fletcher',
           character_name: '6th Officer Moody' },
         { id: 150621,
           name: 'Scott G. Anderson',
           character_name: 'Frederick Fleet' },
         { id: 491466,
           name: 'Martin East',
           character_name: 'Reginald Lee' },
         { id: 497211,
           name: 'Gregory Cooke',
           character_name: 'Jack Phillips' },
         { id: 443871,
           name: 'Alexandrea Owens',
           character_name: 'Cora Cartmell' },
         { id: 451449,
           name: 'Seth Adkins',
           character_name: 'Slovakian 3 Year Old Boy' },
         { id: 193636,
           name: 'Michael Ensign',
           character_name: 'Benjamin Guggenheim' },
         { id: 123735,
           name: 'Anatoly M. Sagalevitch',
           character_name: 'Anatoly Milkailavich' } ],
      free_web_sources: [],
      free_ios_sources: [],
      free_android_sources: [],
      tv_everywhere_web_sources:
       [ { source: 'xfinity_tveverywhere',
           display_name: 'Xfinity',
           tv_channel: 'Cinemax',
           link: 'http://xfinitytv.comcast.net/watch/Titanic/6639635699309382112/633880643913/Titanic-%28Cinemax%29/videos' },
         { source: 'maxgo',
           display_name: 'MAX GO',
           tv_channel: 'Cinemax',
           link: 'http://www.maxgo.com/#movies/video&assetID=MGOROSTGP33064?videoMode=embeddedVideo/' } ],
      tv_everywhere_ios_sources:
       [ { source: 'maxgo',
           display_name: 'MAX GO',
           tv_channel: 'Cinemax',
           link: 'maxgo://deeplink/MO.MO/MGOROSTGP33064',
           app_name: 'MAX GO',
           app_link: 1,
           app_required: 1,
           app_download_link: 'itms-apps://itunes.apple.com/app/max-go/id453560335' } ],
      tv_everywhere_android_sources:
       [ { source: 'maxgo',
           display_name: 'MAX GO',
           tv_channel: 'Cinemax',
           link: 'maxgo://deeplink/MO.MO/MGOROSTGP33064',
           app_name: 'MAX GO',
           app_link: 1,
           app_required: 1,
           app_download_link: 'https://play.google.com/store/apps/details?id=com.MAXGo' } ],
      subscription_web_sources: [],
      subscription_ios_sources: [],
      subscription_android_sources: [],
      purchase_web_sources:
       [ { source: 'itunes',
           display_name: 'iTunes',
           link: 'https://itunes.apple.com/us/movie/titanic/id545892907?uo=4&at=10laHb',
           formats: [Object] },
         { source: 'amazon_buy',
           display_name: 'Amazon',
           link: 'http://www.amazon.com/gp/product/B00A3ZJIY6',
           formats: [Object] },
         { source: 'vudu',
           display_name: 'VUDU',
           link: 'http://click.linksynergy.com/fs-bin/click?id=Pz66xbzAbFo&subid=&offerid=251672.1&type=10&tmpid=9417&RD_PARM1=http%3A%2F%2Fwww.vudu.com%2Fmovies%2F%23%21content%2F14430%2FTitanic',
           formats: [Object] },
         { source: 'google_play',
           display_name: 'Google Play',
           link: 'https://play.google.com/store/movies/details/Titanic?id=jIhicnTgArM',
           formats: [Object] },
         { source: 'cinemanow',
           display_name: 'CinemaNow',
           link: 'http://www.cinemanow.com/title/465141',
           formats: [Object] },
         { source: 'youtube_purchase',
           display_name: 'YouTube',
           link: 'http://www.youtube.com/watch?v=jIhicnTgArM',
           formats: [Object] },
         { source: 'sony',
           display_name: 'Sony Entertainment Network',
           link: 'https://store.sonyentertainmentnetwork.com/#!/en-us/movies/cid=UV0011-NPVA60060_CN-0000000000150609',
           formats: [Object] } ],
      purchase_ios_sources:
       [ { source: 'itunes',
           display_name: 'iTunes',
           link: 'itms://itunes.apple.com/us/movie/titanic/id545892907?uo=4&at=10laHb',
           app_name: 'iTunes',
           app_link: 1,
           app_required: 1,
           app_download_link: 'itms-apps://',
           formats: [Object] },
         { source: 'vudu',
           display_name: 'VUDU',
           link: 'http://click.linksynergy.com/fs-bin/click?id=Pz66xbzAbFo&subid=&offerid=251672.1&type=10&tmpid=9417&RD_PARM1=http%3A%2F%2Fwww.vudu.com%2Fmovies%2F%23%21content%2F14430%2FTitanic',
           app_name: 'VUDU',
           app_link: 0,
           app_required: 0,
           app_download_link: 'itms-apps://itunes.apple.com/app/vudu-player-movies-tv/id487285735',
           formats: [Object] } ],
      purchase_android_sources:
       [ { source: 'vudu',
           display_name: 'VUDU',
           link: 'vuduandroidapp://_type/deeplink/token/?refid=&refcontentid=14430#!content%2F14430',
           app_name: 'VUDU',
           app_link: 1,
           app_required: 1,
           app_download_link: 'https://play.google.com/store/apps/details?id=air.com.vudu.air.DownloaderTablet',
           formats: [Object] },
         { source: 'google_play',
           display_name: 'Google Play',
           link: 'https://play.google.com/store/movies/details/Titanic?id=jIhicnTgArM',
           app_name: 'Google Play',
           app_link: 0,
           app_required: 0,
           app_download_link: 'https://play.google.com/store',
           formats: [Object] } ],
      other_sources: { tv_on_demand: [ [Object], [Object] ] } }
    );
  }
  var type = req.params.type;
  var id = req.params.id;
  var baseUrl = 'https://api-public.guidebox.com/v1.43/US/' + process.env.GUIDEBOX_KEY;
  var options;
  var second_url;
  if (type === 'movie') {
    options = {
      method: 'GET',
      url: baseUrl + '/search/movie/id/imdb/' + id,
    };
    second_url = '/movie/';
  } else {
    options = {
      method: 'GET',
      url: baseUrl + '/search/id/imdb/' + id,
    };
    second_url = '/show/';
  }
  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    var guideboxId = JSON.parse(body).id;
    var options = {
      method: 'GET',
      url: baseUrl + second_url + guideboxId,
    };

    request(options, function(err, resp, bod) {
      if (err) throw new Error(err);
      res.status(200).json(JSON.parse(bod));
    });
  });
}

function deleteMovie(req, res, next) {
  var query = { _id: req.params.user_id };

  User.findOneAndUpdate(query, { $pull: { movies: { imdbID: req.params.id }}}, {new: true})
  .then(function(data) {
    res.status(200).json({status: 'success', data: data});
  })
  .catch(function(err) {
    res.status(400).json({status: 'danger', data: err});
  });
}

module.exports = router;
