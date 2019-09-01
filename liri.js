require("dotenv").config();
//OH SO MANY VAR's
var keys = require("./keys.js");
var request = require("request");
// var spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify)
var fs = require("fs");
var moment = require("moment"); //This is for formating
//VAR's for user action and inputs
var input = process.argv;
var action = input[2];
var inputs = input.slice(3).join(" "); //This is what the user types in (parameters)
//Switches for user actions
switch (action) {
  case "spotify-this-song":
    spotify(inputs);
    break;

  case "movie-this":
    movie(inputs);
    break;

  case "concert-this":
    concert(inputs);
    break;

  case "do-what-it-says":
    doIt(inputs);
    break;
}
//OMDB API CALL
function movie(inputs) {
  var queryUrl =
    "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function(error, response, body) {
    if (inputs === undefined) {
      inputs = "TESTING";
    }
    var results = JSON.parse(body);      
    //The follwing results are displayed if there's no Error
    if (!error && response.statusCode === 200) {
      console.log("Title: " + results.Title);
      console.log("Release Year: " + results.Year);
      console.log("IMDB Rating: " + results.imdbRating);
      console.log("Rotten Tomatoes Rating: " + results.Ratings[1].Value);
      console.log("Country: " + results.Country);
      console.log("Language: " + results.Language);
      console.log("Plot: " + results.Plot);
      console.log("Actors: " + results.Actors);
    }
  });
}
//Concert API call
function concert(inputs) {
  var queryUrl =
  "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

  request(queryUrl, function(error, response, body) {
    if (!inputs) {
      inputs = "Not today, Jack";
    }
    //Shorthand for console logging results
    var result = JSON.parse(body)[0];
    if (!error && response.statusCode === 200) {
      console.log("City: " + result.venue.city);
      console.log("Venue Name: " + result.venue.name);
      //moment.js for formatting the date
      console.log(
        "Event Date: " + moment(result.datetime).format("YYYY/MM/DD")
      );
    }
  });
}
//Function to read the random.txt file
function doIt(inputs) {
  fs.readFile("random.txt", "utf-8", function(err, response) {
    console.log(response.toString());
  });
}

//Spotify API call
function spotify(inputs) {
  //.ENV stored keys to stay hidden
  var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
  });

  if (inputs === undefined || null) {
    inputs = "TESTING";
  }
  spotify.search({ type: "track", query: inputs }, function(err, data) {
    if (err) {
      console.log("Error detected: " + err);
      return;
    }

    var songInfo = data.tracks.items;
    console.log("Artist(s): " + songInfo[0].artists[0].name);
    console.log("Song Name: " + songInfo[0].name);
    console.log("Preview Link: " + songInfo[0].preview_url);
    console.log("Album: " + songInfo[0].album.name);
  });
}