const fs = require("fs");

module.exports = function parseGugliFile(path, gugliFileName){
    var csv = fs.readFileSync(path + "/" + gugliFileName);

    console.log("CSV", csv.toString());

    var data = csv.toString().split("\r\n");
    data.pop();
    // data.filter(function removeEmptyElements(element){return !!element});

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
            team1: {
                name: gugliRound.summary[3],
                score: n(gugliRound.summary[5]),
                playerStats: []
            },
            team2: {
                name: gugliRound.summary[7],
                score: n(gugliRound.summary[9]),
                playerStats: []
            }
        };

        gugliRound.playerStats.forEach(function seperateHomeFromAwayStats(stats){
            let team1Stats = {
                playerName: stats[0],
                Assists: n(stats[1]),
                Kills: n(stats[2]),
                Deaths: n(stats[3]),
                NetDamage: n(stats[4])
            }

            let team2Stats = {
                playerName: stats[5],
                Assists: n(stats[6]),
                Kills: n(stats[7]),
                Deaths: n(stats[8]),
                NetDamage: n(stats[9])
            }

            round.team1.playerStats.push(team1Stats);
            round.team2.playerStats.push(team2Stats);
        });

        roundResults.push(round);
    });

    return roundResults;
}

function n(str){
    return Number(str);
}