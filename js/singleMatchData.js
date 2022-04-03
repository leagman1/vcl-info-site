const fs = require("fs");

module.exports = function buildMatchData(seasonData, matchID){
    var weekID = parseInt(matchID / (seasonData.matches.length));
    var matchID = matchID % seasonData.matches[0].length;

    var pathString = "./data/season-data/Season " +
        (seasonData.selectedSeason.id + 1) +
        "/Match data/Week " + (weekID + 1) +
        "/Match " + (matchID + 1);

    // find MATCH_STATS_CONTROL_... file
    fs.readdir(pathString, function (err, files) {
        if(err) {
            console.log("ERROR", err);
            return;
        }

        var statFileObjects = [];

        files.forEach(function getAndSortFileName(file){
            if(file.indexOf("MATCH_STATS_CONTROL") != -1){
                var dateTime = file.split("_")[4];
                var dateTime = dateTime.replace("-", ".").split(".");
                dateTime.pop(); // remove ".json"

                var dateTime = new Date(...dateTime);

                statFileObjects.push({file: file, timestamp: dateTime.valueOf()});
            }
        });

        statFileObjects.sort(function sortByDateTime(firstFile, secondFile){
            if(firstFile.timestamp < secondFile.timestamp){
                return -1;
            } else {
                return 1;
            }

            return 0; // ;-)
        });

        statFileObjects.forEach(function buildRoundStats(file, roundID){
            let matchStatsFile = fs.readFileSync(pathString + "/" + file.file);
            let matchStats = JSON.parse(matchStatsFile);

            for(let playerStats of matchStats.Players){
                let currentPlayerID = resolvePlayerAlias(playerStats.user);

                // seasonData.matches[weekID][matchID][roundID].home.roundPlayers

                for(let homePlayer of )
            }

            seasonData.matches[weekID][matchID][roundID].home.playerStats = [];

            seasonData.matches[weekID][matchID][roundID].away.playerStats = [];
        })

        console.log("STAT FILES", statFiles);
    });

    var selectedMatch = seasonData.matches[weekID][matchID];

    return;
}

let playerAliasesFile = fs.readFileSync("./data/playerAliases.json");
let playerAliases = JSON.parse(playerAliasesFile);

function resolvePlayerAlias(playerAlias){
    return playerAliases[playerAlias] || false;
}