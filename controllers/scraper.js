let express = require('express');
let router = express.Router();
let request = require('request');
let cheerio = require('cheerio');
let mongoose = require('mongoose');

// Set mongoose to leverage built in JavaScript ES6 Promises

mongoose.Promise = Promise;

let Note = require("../models/Note");

let Article = require("../models/Articles");

router.get("/", function (req, res) {
    res.render("index");
});

// This will get the articles scraped and saved in db and show them in list //
router.get("/articlesaved", function (req, res) {
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
            res.render("articlesaved", hbsArticleObject);
        }
    });
});

// Export routes for server.js to use.
module.exports = router;