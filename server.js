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
//listen on port 8080
app.listen(PORT, function(){
    console.log('App running on port ' + PORT + '!');
});