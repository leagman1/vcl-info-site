const fs = require("fs");

const parseFileGugliFormat = require("./parseGugliFile.js");
const parseMATCH_STATS_files = require("./parseMATCH_STATS_files.js");

module.exports = function buildMatchData(seasonData, matchID){
    var weekID = parseInt(matchID / (seasonData.matchesPerWeek));
    var matchID = matchID % seasonData.matches[0].length;

    var pathString = "./data/season-data/Season " +
        (seasonData.selectedSeason.id + 1) +
        "/Match data/Week " + (weekID + 1) +
        "/Match " + (matchID + 1);

    var match;
    
    var files = fs.readdirSync(pathString);

    if(files.indexOf("match-results.csv") != -1){
        console.log("Parsing: GugliFile");

        var roundResults = parseFileGugliFormat(pathString, files[files.indexOf("match-results.csv")]);

        seasonData.matches[weekID][matchID].roundResults = roundResults;

        // parse .csv files in Gugli-format
        return true;

    } else if(files.indexOf("matchresults.json") != -1) {
        console.log("Parsing: MATCH_STATS");

        // parse .sjon file and MATCH_STATS.jsons
        parseMATCH_STATS_files(pathString, files, seasonData.matches[weekID][matchID]);
        return true;

    } else {
        console.log("Parsing: nothing");
        return false;
    }
}