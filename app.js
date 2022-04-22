const express = require('express');
const app = express();
const port = 80;

const path = require("path");
const favicon = require('serve-favicon')

const getSeasonData = require("./js/seasonData.js");

const fs = require("fs");

app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'img/favicon/favicon.ico')))

app.get('/', (req, res) => {
  res.redirect("/standings?season=1");
});

app.get('/standings', (req, res) => renderStandingsPage(req, res));
app.get('/matches', (req, res) => renderPage(req, res));
app.get('/teams', (req, res) => renderPage(req, res));
app.get('/map-pool', (req, res) => renderPage(req,res));
app.get('/rules', (req, res) => renderPage(req,res));

app.get("/match", (req, res) => renderMatchPage(req, res));

app.get("*", (req,res) => render404(req, res));

function renderPage(req, res){
  try {
    var getMatchData = require("./js/matchData.js");
    var seasonData = getSeasonData(req.query.season);

    if(seasonData.matches){
      seasonData.matches.forEach(function(week, weekIndex){
        week.forEach(function(match, matchIndex){
          let matchDataFound = getMatchData(seasonData, matchIndex, weekIndex);
          seasonData.matches[weekIndex][matchIndex].matchDataFound = matchDataFound;
        });
      });
    }

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

function renderMatchPage(req, res){
  try {
    var seasonData = getSeasonData(req.query.season);

    var matchID = req.query.id;
    var weekID = (matchID - (matchID % seasonData.matches[0].length)) / seasonData.matches[0].length; // parseInt(matchID / (seasonData.matches[0].length));

    matchID = matchID % seasonData.matches[0].length;

    // get match data
    var matchDataFound = require("./js/matchData.js")(seasonData, matchID, weekID);

    res.render(req.path.substring(1), {
      seasonData: seasonData,
      matchDataFound: matchDataFound,
      match: seasonData.matches[weekID][matchID]
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

function renderStandingsPage(req, res){
  try {
    let getMatchData = require("./js/matchData.js");

    let seasonData = getSeasonData(req.query.season);

    if(!seasonData.matches || !seasonData.teams){
      res.render(req.path.substring(1), {
        standings: false
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

      return;
    }

    seasonData.teams.forEach(function initialiseStandingsProperties(team, teamIndex){
      team.aggregates = {
        wins: 0,
        roundsWon: 0,
        // roundsDraw: 0,
        roundsLost: 0,

        controlScoreSelf: 0,
        controlScoreOpponent: 0
      }
    });

    if(seasonData.matches){
      seasonData.matches.forEach(function calculateStandings_week(week, weekIndex){
        week.forEach(function calculateStandings_match(match, matchIndex){
          match.home.roundsWon = 0;
          match.away.roundsWon = 0;

          getMatchData(seasonData, matchIndex, weekIndex); // side effecting like a pro

          if(match.roundStats){
            match.roundStats.forEach(function (round) {
              match.home.aggregates.controlScoreSelf += round.home.score;
              match.home.aggregates.controlScoreOpponent += round.away.score;

              match.away.aggregates.controlScoreSelf += round.away.score;
              match.away.aggregates.controlScoreOpponent += round.home.score;
  
              if(round.home.score > round.away.score){
                match.home.roundsWon++;

                match.home.aggregates.roundsWon++;
                match.away.aggregates.roundsLost++;
              } else if (round.home.score < round.away.score){
                match.away.roundsWon++;

                match.away.aggregates.roundsWon++;
                match.home.aggregates.roundsLost++;
              } else {
                match.home.aggregates.roundsDraw++;
                match.away.aggregates.roundsDraw++;
              }
            })
          }

          if(match.home.roundsWon > match.away.roundsWon){
            match.home.aggregates.wins++;
          } else if(match.home.roundsWon < match.away.roundsWon) {
            match.away.aggregates.wins++;
          } else {
            // should this even occur?
          }
        });
      });
    }

    seasonData.teams.sort(function sortByWinsAndControlScore(team1, team2){
      if(team1.aggregates.wins > team2.aggregates.wins){
        return -1;
      } else if(team1.aggregates.wins < team2.aggregates.wins){
        return 1
      } else if(team1.aggregates.wins == team2.aggregates.wins){
        let homeNetCS = team1.aggregates.controlScoreSelf - team1.aggregates.controlScoreOpponent;
        let awayNetCS = team2.aggregates.controlScoreSelf - team2.aggregates.controlScoreOpponent;
        // if same number of wins, decide by control score
        if(homeNetCS > awayNetCS){
          return -1;
        } else if(homeNetCS < awayNetCS){
          return 1;
        } else {
          return 0; // shrug
        }
      } else {
        return 0;
      }
    });

    if(seasonData.teams){
      // aggregate team data and calculate standings
    }

    res.render(req.path.substring(1), {
      seasonData: seasonData,
      standings: seasonData.teams
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

app.listen(port, () => {
  console.log(`vcl-info-site listening on port ${port}`);
});