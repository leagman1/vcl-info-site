const fs = require("fs");

module.exports = function buildMatchData(seasonData, matchID){
    var weekID = parseInt(matchID / (seasonData.matchesPerWeek));
    var matchID = matchID % seasonData.matches[0].length;

    var pathString = "./data/season-data/Season " +
        (seasonData.selectedSeason.id + 1) +
        "/Match data/Week " + (weekID + 1) +
        "/Match " + (matchID + 1);

    var match;
    
    var files = fs.readdirSync(pathString);

    var statFileObjects = [];

    files.forEach(function (file) {
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

    let playerAliasesFile = fs.readFileSync("./data/playerAliases.json");
    let playerAliases = JSON.parse(playerAliasesFile);

    match = seasonData.matches[weekID][matchID];

    let manualResults = fs.readFileSync(pathString + "/match-results.json");
    match.roundStats = JSON.parse(manualResults);

    statFileObjects.forEach(function buildPlayerStats(file, roundIndex){
        let currentRound = match.roundStats[roundIndex];

        currentRound.home.playerStats = [];
        currentRound.away.playerStats = [];

        let matchStatsFile = fs.readFileSync(pathString + "/" + file.file);
        let matchStats = JSON.parse(matchStatsFile);

        for(let playerStats of matchStats.Players){
            let currentPlayerID = resolvePlayerAlias(playerStats.user, playerAliases);
            playerStats.user = currentPlayerID;

            let filteredPlayerStats = filterPlayersStats(playerStats);

            if(isPlayerInTeam(currentPlayerID, match.home)){
                currentRound.home.playerStats.push(filteredPlayerStats);
            } else {
                currentRound.away.playerStats.push(filteredPlayerStats);
            }
        }

        currentRound.home.playerStats.sort((firstPlayer, secondPlayer) => firstPlayer.user > secondPlayer.user);
        currentRound.away.playerStats.sort((firstPlayer, secondPlayer) => firstPlayer.user > secondPlayer.user);
    });

    return match;
}

function resolvePlayerAlias(playerAlias, allAliases){
    return allAliases[playerAlias] || false;
}

function isPlayerInTeam(playerID, team){
    return team.members.some((player) => player.id == playerID);
}

function filterPlayersStats(playerStats){
    var statsToTrack = [
        "Kills",
        "Deaths",
        "Assists",
        "DamageGiven",
        "DamageTaken"
    ];

    var readableStatsMap = {
        "DamageGiven": "Damage Given",
        "DamageTaken": "Damage Taken"
    };

    var filteredStats = {

    };

    for(let stat in playerStats){
        if(statsToTrack.indexOf(stat) != -1){
            filteredStats[stat] = {
                value: playerStats[stat],
                statDisplayName: readableStatsMap[stat] || stat
            };
        }
    }

    filteredStats.playerName = playerStats.DisplayName;

    return filteredStats;
}