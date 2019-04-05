let express = require('express');
let mongoose = require('mongoose');
let cheerio = require('cheerio');
let axios = require('axios');
let path = require('path');
let mongojs = require('mongojs');
let app = express();

module.exports = function(app){
let databaseUrl = 'mongodb://htira:Password1@ds051575.mlab.com:51575/heroku_xpjhg5b1';
let collections = ['articles'];

let db = mongojs(databaseUrl, collections);

db.on('error', function(error) {
	console.log('Database Error:', error);
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

app.get('/news', (req, res) => {
	db.articles.find(function(err, result) {
		if (err) {
			console.log(err);
		}
		res.json(result);
	});
});

app.get('/api/news', (req, res) => {
	axios.get('https://www.nytimes.com')
		.then(function(response) {
			let $ = cheerio.load(response.data);
			db.articles.remove({});
			$('article').each(function(i, element) {
				let result = {};
				result.title = $(element).children().text();
				result.link = $(element).find('a').attr('href');
				result.comment = '';
				db.articles.save(result);
			});
		});
});
};