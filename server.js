let express = require('express');
let bodyParser = require('body-parser');
let logger = require('morgan');
let mongoose = require('mongoose');
//Scraping tools
let request = require('request');
let cheerio = require('cheerio');
//Requiring Note and Article models
let Note = require('./models/Note');
let Artice = require('./models/Articles');
//set mongoose
mongoose.Promise = Promise;
let app = express();
let PORT = process.env.PORT || 8080;
// Use morgan and body parser //
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
 extended: false
}));
// Serve static content //
app.use(express.static('public'));
// Set Handlebars //
let exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main', extname: 'handlebars'}));
app.set('view engine', 'handlebars');

// Import routes and give the server access to them //
let routes = require('./controllers/scraperController.js');
app.use('/', routes);
mongoose.connect('mongodb://htira:Password1@ds051575.mlab.com:51575/heroku_xpjhg5b1');
let db = mongoose.connection;

// Show any mongoose errors //
db.on('error', function(error) {
    console.log('Mongoose Error: ', error);
  });
// Once logged in to the db through mongoose, log a success message //
   db.once("open", function() {
   console.log("Mongoose connection is successful.");
  });


//listen on port 8080
app.listen(PORT, function(){
    console.log('App running on port ' + PORT + '!');
});