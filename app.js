const express = require('express');
const app = express();
const port = 8080;

const path = require("path");
const favicon = require('serve-favicon')

const vclController = require("./js/controller.js");

const fs = require("fs");

app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'img/favicon/favicon.ico')))

app.get('/overview', (req, res) => {
  try {
    var currentSeason = vclController.getSeasonObject(req.query.season - 1);

    res.render('overview', {
      seasons: vclController.seasons,
      currentSeason: currentSeason
    },
      function renderCallback(err, html) {
        if(err){
          res.send("An error occured, lel");
        } else {
          res.send(html);
        }
      }
    );

  } catch (err){
    res.send("An error occured, lel");
  }
});

app.get('/matches', (req, res) => {
  try {
    var currentSeason = vclController.getSeasonObject(req.query.season - 1);

    res.render('matches', {
      seasons: vclController.seasons,
      currentSeason: currentSeason
    },
      function renderCallback(err, html) {
        if(err){
          res.send("An error occured, lel");
        } else {
          res.send(html);
        }
      }
    );

  } catch (err){
    res.send("An error occured, lel");
  }
});

app.get('/teams', (req, res) => {
  try {
    var currentSeason = vclController.getSeasonObject(req.query.season - 1);

    res.render('teams', {
      seasons: vclController.seasons,
      currentSeason: currentSeason
    },
      function renderCallback(err, html) {
        if(err){
          res.send("An error occured, lel");
        } else {
          res.send(html);
        }
      }
    );

  } catch (err){
    res.send("An error occured, lel");
  }
});

app.get('/map-pool', (req, res) => {
  try {
    var currentSeason = vclController.getSeasonObject(req.query.season - 1);
    var mapPool = vclController.getMapPool(currentSeason);

    res.render('map-pool', {
      seasons: vclController.seasons,
      currentSeason: currentSeason,
      mapPool: mapPool
    },
      function renderCallback(err, html) {
        if(err){
          console.log("ERROR", err);
          res.send("An error occured, lel");
        } else {
          res.send(html);
        }
      }
    );

  } catch (err){
    console.log("ERROR", err);
    res.send("An error occured, lel");
  }
});

/**
 * rules
 app.get('/rules', (req, res) => {
  try {
    var currentSeason = vclController.getSeasonObject(req.query.season - 1);

    res.render('rules', {
      seasons: vclController.seasons,
      currentSeason: currentSeason
    },
      function renderCallback(err, html) {
        if(err){
          res.send("An error occured, lel");
        } else {
          res.send(html);
        }
      }
    );

  } catch (err){
    res.send("An error occured, lel");
  }
});

 */

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});