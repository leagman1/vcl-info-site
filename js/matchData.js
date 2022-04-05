const fs = require("fs");

const parseFileGugliFormat = require("./parseGugliFile.js");
const parseMATCH_STATS_files = require("./parseMATCH_STATS_files.js");

module.exports = function buildMatchData(seasonData, matchID, weekID){
    var pathString = "./data/season-data/Season " +
        (seasonData.selectedSeason.id + 1) +
        "/Match data/Week " + (weekID + 1) +
        "/Match " + (matchID + 1);
    
    var files = fs.readdirSync(pathString);

    if(files.indexOf("match-results.csv") != -1){
        // parse .csv files in Gugli-format
        var roundStats = parseFileGugliFormat(pathString, files[files.indexOf("match-results.csv")]);

        seasonData.matches[weekID][matchID].roundStats = roundStats;

        return true;

    } else if(files.indexOf("matchresults.json") != -1) {
        // parse .sjon file and MATCH_STATS.jsons
        parseMATCH_STATS_files(pathString, files, seasonData.matches[weekID][matchID]);
        return true;

    } else {
        return false;
    }
}