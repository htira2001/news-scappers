let express = require('express');
let router = express.Router();
let request = require('request');
let cheerio = require('cheerio');
let mongoose = require('mongoose');

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;
let Note = require('../models/Note');
let Article = require('../models/Articles');

router.get('/', function (req, res) {
    res.render('index');
});

// This will get the articles scraped and saved in db and show them in list //
router.get('/articlesaved', function (req, res) {
    // Grab every doc in the Articles array //

    Article.find({}, function (error, doc) {
        if (error) {
            console.log(error);
        }

        // Or send the doc to the browser as a jSON object //
        else {
            let hbsArticleObject = {
                articles: doc
            };
            res.render('articlesaved', hbsArticleObject);
        }
    });
});
// A GET request to scrape the New York Times website
router.post('/scrape', function (req, res) {
    // First, we grab the body of the html with request
    request('http://www.nytimes.com/', function (error, response, html) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        let $ = cheerio.load(html);
        // Make emptry array for temporarily saving and showing scraped Articles.
        let scrapedArticles = {};
        // Now, we grab every h2 within an article tag, and do the following:
        $('article').each(function (i, element) {
            // Save an empty result object //
            let result = {};
            // Add the text and href of every link, and save them as properties of the result object //
            result.title = $(this).children('h2').text();
            result.summary = $(this).children('.summary').text();
            console.log('This is the summary: ' + result.summary);
            result.link = $(this).children('h2').children('a').attr('href');
            scrapedArticles[i] = result;
        });
        console.log('Scraped Articles object built nicely: ' + scrapedArticles);

        let hbsArticleObject = {
            articles: scrapedArticles
        };
        res.render('index', hbsArticleObject);
    });
});

router.post('/save', function (req, res) {
    console.log('This is the title: ' + req.body.title);
    let newArticleObject = {};
    newArticleObject.title = req.body.title;
    newArticleObject.link = req.body.link;
    let entry = new Article(newArticleObject);
    console.log('We can save the article: ' + entry);

    // Now, save that entry to the db
    entry.save(function (err, doc) {

        if (err) {
            console.log(err);
        } else {
            console.log(doc);
        }
    });
    res.redirect('/articlesaved');
});

router.get('/delete/:id', function (req, res) {
    Article.findOneAndRemove({
        '_id': req.params.id
    }, function (err, offer) {

        if (err) {
            console.log('Not able to delete:' + err);
        } else {
            console.log('Successfully deleted!');
        }
        res.redirect('/savedarticles');
    });
});

router.get('/notes/:id', function (req, res) {
    console.log('ID is getting read for delete' + req.params.id);
    console.log('Able to activate delete function.');
    Note.findOneAndRemove({
        '_id': req.params.id
    }, function (err, doc) {
        if (err) {
            console.log('Not able to delete:' + err);

        } else {
            console.log('Successfully deleted!');
        }
        res.send(doc);
    });
});
// This will grab an article by it's ObjectId

router.get('/articles/:id', function (req, res) {
    console.log('ID is getting read' + req.params.id);

    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...

    Article.findOne({
            '_id': req.params.id
        })
        .populate('notes')
        .exec(function (err, doc) {
            if (err) {
                console.log('Not able to find article and get notes.');

            } else {
                console.log('We are getting article and possible notes ' + doc);
                res.json(doc);
            }
        });
});
// Create a new note or replace an existing note
router.post('/articles/:id', function (req, res) {
    // Create a new note and pass the req.body to the entry
    let newNote = new Note(req.body);
    // And save the new note the db
    newNote.save(function (error, doc) {
        // Log any errors
        if (error) {
            console.log(error);
        } else {
            // Use the article id to find it and then push note
            Article.findOneAndUpdate({
                    '_id': req.params.id
                }, {
                    $push: {
                        notes: doc._id
                    }
                }, {
                    new: true,
                    upsert: true
                })
                .populate('notes')
                .exec(function (err, doc) {
                    if (err) {
                        console.log('Cannot find article.');
                    } else {
                        res.send(doc);
                    }
                });
        }
    });
});

// Export routes for server.js to use.
module.exports = router;