const fs = require("fs");

let playersFile = fs.readFileSync("data/players.json");
const players = JSON.parse(playersFile);

let mapFile = fs.readFileSync("data/maps.json");
const maps = JSON.parse(mapFile); // all maps

let seasonFile = fs.readFileSync("data/seasons.json");
const seasons = JSON.parse(seasonFile);

function getPlayerById(playerID){
    for(let i = 0; i< players.length; i++){
        if(players[i].id == playerID){
            return players[i];
        }
    }

    return false;
}

function getSeasonObject(seasonID){
    for(let season of seasons){
        if(season.id == seasonID){
            return season;
        }
    }
}

function getMapPool(season){
    var mapPool = maps.filter(function(map){
        return season.mapPool.indexOf(map.id) != -1;
    });

    mapPool = mapPool.map(function resolvePlayerIDs(map){
        if(typeof map.creator == "number"){
            map.creator = getPlayerById(map.creator).name;
        }

        if(typeof map.portedBy == "number"){
            map.portedBy = getPlayerById(map.portedBy).name;
        }

        return map;
    });

    return mapPool;
}

module.exports = {
    seasons: seasons,
    players: players,
    maps: maps,

    getSeasonObject: getSeasonObject,
    getPlayerById: getPlayerById,
    getMapPool: getMapPool
};