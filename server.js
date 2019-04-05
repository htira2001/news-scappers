let express = require('express');
let mongoose = require('mongoose');
let cheerio = require('cheerio');
let axios = require('axios');
let path = require('path');
let mongojs = require('mongojs');
let app = express();
let PORT = process.env.PORT || 8080;

let MONGODB_URI = 'mongodb://htira:Password1@ds051575.mlab.com:51575/heroku_xpjhg5b1';
mongoose.connect(MONGODB_URI);

app.use(express.urlencoded({
	extended: true
}));
app.use(express.json());
app.use(express.static('public'));

require('./routes/htmlRoutes.js')(app);

app.listen(PORT, function() {
	console.log('App listening on port: ' + PORT);
});