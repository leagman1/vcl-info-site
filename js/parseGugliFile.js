const fs = require("fs");

module.exports = function parseGugliFile(path, gugliFileName){
    var csv = fs.readFileSync(path + "/" + gugliFileName);

    var data = csv.toString().split("\r\n");
    data.pop();

    var gugliData = [];

    // prepare the csv-data a bit
    for(let line of data){
        var columns = line.split(";");

        if(columns[0] == "Match"){
            let result = {
                summary: columns,
                playerStats: []
            };

            gugliData.push(result);
        } else if(columns[0] == "Name"){
            continue;
        } else {
            gugliData[gugliData.length - 1].playerStats.push(columns);
        }
    }

    var roundResults = [];

    // properly process the csv-rows/columns
    gugliData.forEach(function transformGugliData(gugliRound){
        let round = {
            home: {
                score: gugliRound.summary[5],
                playerStats: []
            },
            away: {
                score: gugliRound.summary[9],
                playerStats: []
            }
        };

        gugliRound.playerStats.forEach(function seperateHomeFromAwayStats(stats){
            let homeStats = {
                playerName: stats[0],
                Assists: stats[1],
                Kills: stats[2],
                Deaths: stats[3],
                NetDamage: stats[4]
            }

            let awayStats = {
                playerName: stats[5],
                Assists: stats[6],
                Kills: stats[7],
                Deaths: stats[8],
                NetDamage: stats[9]
            }

            round.home.playerStats.push(homeStats);
            round.away.playerStats.push(awayStats);
        });

        roundResults.push(round);
    });

    return roundResults;
}