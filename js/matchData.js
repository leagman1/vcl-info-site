const fs = require("fs");

const parseFileGugliFormat = require("./parseGugliFile.js");
const parseMATCH_STATS_files = require("./parseMATCH_STATS_files.js");

module.exports = function buildMatchData(seasonData, matchID, weekID){
    var pathString = "./data/season-data/Season " +
        (seasonData.selectedSeason.id + 1) +
        "/Match data/Week " + (weekID + 1) +
        "/Match " + (matchID + 1);
    
    var files = fs.readdirSync(pathString);

    seasonData.matches[weekID][matchID].home.roundsWon = 0;
    seasonData.matches[weekID][matchID].away.roundsWon = 0;
    seasonData.matches[weekID][matchID].winner = "none";

    if(files.indexOf("match-results.csv") != -1){
        // parse .csv files in Gugli-format
        var roundStats = parseFileGugliFormat(pathString, files[files.indexOf("match-results.csv")]);

        var homeTeamID = seasonData.matches[weekID][matchID].home.id;

        // assign home and away team; their order isn't always the same as in the match schedule
        roundStats.forEach(function findOutHomeAway(round){
            var team1ID = resolveTeamAlias(round.team1.name, seasonData.teamAliases);

            if(team1ID == homeTeamID){
                round.home = round.team1;
                round.away = round.team2;
                delete round.team1;
                delete round.team2;
            } else {
                round.home = round.team2;
                round.away = round.team1;
                delete round.team2;
                delete round.team1;
            }
        });

        seasonData.matches[weekID][matchID].roundStats = roundStats;

        roundStats.forEach(function countRoundsWon(round){
            if(round.home.score > round.away.score){
                seasonData.matches[weekID][matchID].home.roundsWon++;
            } else if(round.away.score > round.home.score) {
                seasonData.matches[weekID][matchID].away.roundsWon++;
            }
        });

        return true;

    } else if(files.indexOf("matchresults.json") != -1) {
        // parse .sjon file and MATCH_STATS.jsons
        parseMATCH_STATS_files(pathString, files, seasonData.matches[weekID][matchID]);
        return true;

    } else {
        return false;
    }
}

function resolveTeamAlias(teamAlias, teamAliases){
    return teamAliases[teamAlias] || false;
}