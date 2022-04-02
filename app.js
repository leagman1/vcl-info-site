const express = require('express');
const app = express();
const port = 8080;

const path = require("path");
const favicon = require('serve-favicon')

const getSeasonData = require("./js/seasonData.js");

console.log("GETSEASON DATA", getSeasonData);

const fs = require("fs");

app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'img/favicon/favicon.ico')))

app.get('/', (req, res) => {
  res.redirect("/overview?season=2");
});

app.get('/overview', (req, res) => renderPage(req, res));
app.get('/matches', (req, res) => renderPage(req, res));
app.get('/teams', (req, res) => renderPage(req, res));
app.get('/map-pool', (req, res) => renderPage(req,res));
app.get('/rules', (req, res) => renderPage(req,res));

app.get("*", (req,res) => render404(req, res));

function renderPage(req, res){
  try {
    var seasonData = getSeasonData(req.query.season);

    res.render(req.path.substring(1), {
      seasonData: seasonData
    },
      function renderCallback(err, html) {
        if(err){
          console.log("RENDER ERROR", err);
          res.render("error", {error: err});
        } else {
          res.send(html);
        }
      }
    );

  } catch (err){
    console.log("ERROR", err);
    res.render("error", {error: err});
  }
}

function render404(req, res){
  try {
    res.render("404", {},
      function renderCallback(err, html) {
        if(err){
          console.log("RENDER ERROR", err);
          res.render("error", {error: err});
        } else {
          res.send(html);
        }
      }
    );

  } catch (err){
    console.log("ERROR", err);
    res.render("error", {error: err});
  }
}

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