const fs = require("fs");

function getSeasons(){
    let seasonFile = fs.readFileSync("data/seasons.json");
    return JSON.parse(seasonFile);
}

function getSeasonObject(seasonID, seasonArray){
    for(let season of seasonArray){
        if(season.id == seasonID){
            return season;
        }
    }
}

function getMaps(){
    let mapFile = fs.readFileSync("data/maps.json");
    return JSON.parse(mapFile); // all maps
}

function getMapPool(seasonObject, players){
    var mapPool = getMaps().filter(function(map){
        return seasonObject.mapPool.indexOf(map.id) != -1;
    });

    mapPool = mapPool.map(function resolvePlayerIDs(map){
        if(typeof map.creator == "number"){
            map.creator = getPlayerObjectById(map.creator, players).name;
        }

        if(typeof map.portedBy == "number"){
            map.portedBy = getPlayerObjectById(map.portedBy, players).name;
        }

        return map;
    });

    return mapPool;
}

function getPlayers(){
    let playersFile = fs.readFileSync("data/players.json");
    return JSON.parse(playersFile);
}

function getPlayerObjectById(playerID, players){
    if(!players){

    }
    for(let i = 0; i< players.length; i++){
        if(players[i].id == playerID){
            return players[i];
        }
    }

    return false;
}

function getTeams(seasonID, players){
    try {
        let teamsFile = fs.readFileSync("data/season-data/Season " + (seasonID + 1) + "/teams.json");
        var teams = JSON.parse(teamsFile);

        // resolve player names
        for(let team of teams){
            var members = [];

            for(let player of team.members){
                members.push(getPlayerObjectById(player, players));
            }

            team.members = members;
            team.captain = getPlayerObjectById(team.captain, players);
            team.secondInCommand = getPlayerObjectById(team.secondInCommand, players);
        }

        return teams;
    } catch(err){
        console.log("An error occured: " + err);
    }
}

module.exports = {
    getSeasons: getSeasons,
    getSeasonObject: getSeasonObject,
    getMaps: getMaps,
    getMapPool: getMapPool,
    getPlayers: getPlayers,
    getPlayerObjectById: getPlayerObjectById,
    getTeams: getTeams
};