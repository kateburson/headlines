// Require all models & dependencies
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const db = require('../models/index.js');
// get an instance of router
const router = express.Router();

router.get('/', function(req, res) {
  db.Article.find({}).then(function(dbArticle) {
    res.render('index', {Article: dbArticle});
  });
});

// A GET route for scraping the echoJS website
router.get('/scrape', function(req, res) {
  // First, we grab the body of the html with axios
  axios.get('https://www.dezeen.com/design/').then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    // Save an empty result object
    var result = {};
    // Now, we grab every h2 within an article tag, and do the following:
    $('article').each(function(i, element) {
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children('header').children('h3')
        .text();
      result.description = $(this)
        .children('p')
        .text();
      result.link = $(this)
        .children('header').children('a')
        .attr('href');

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
      .then(function(dbArticle) {
        // View the added result in the console
        console.log(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, log it
        console.log(err);
      });
    });
    

    // Send a message to the client
    res.send('Scrape Complete');
  });
});

// Route for getting all Articles from the db
router.get('/articles', function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({}).then(function(dbArticle) {
    res.json(dbArticle);
  });
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get('/articles/:id', function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with 'note',
  // then responds with the article with the note included
  var id = req.params.id;
  db.Article.findOne({_id : id})
  .populate('note')
  .then(function(data) {
    res.json(data);
  });
});

// Route for saving/updating an Article's associated Note
router.post('/articles/:id', function(req, res) {
  // TODO
  db.Note.create(req.body).then(function(data) {
    db.Article.update({_id : req.params.id}, {note: data._id}, {new: true})
    .then(function(dbArticle) {
      res.json(dbArticle);
    });
  });
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's 'note' property with the _id of the new note
});

router.get('/notes/:id', function(req, res) {
  var id = req.params.id;
  db.Note.find({_id : id})
  .then(function(data) {
    res.json(data);
  });
});

module.exports = router;