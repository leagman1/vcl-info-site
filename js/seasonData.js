const fs = require("fs");

module.exports = function buildSeasonData(seasonID){
    let seasonData = {};

    // get Season
    let seasonFile = fs.readFileSync("data/seasons.json");
    let seasons = JSON.parse(seasonFile);

    seasonData.totalSeasons = seasons.length;

    for(let season of seasons){
        if(season.id == seasonID){
            seasonData.selectedSeason = season;
        }
    }

    // get Players
    let playersFile = fs.readFileSync("data/players.json");
    let players = JSON.parse(playersFile);

    let mapFile = fs.readFileSync("data/maps.json");
    let allMaps = JSON.parse(mapFile);

    // build Map Pool
    let mapPool = allMaps.filter(function(map){
        return seasonData.selectedSeason.mapPool.indexOf(map.id) != -1;
    });

    mapPool = mapPool.map(function resolvePlayerIDs(map){
        if(typeof map.creator == "number"){
            map.creator = getPlayerNameByID(map.creator, players);
        }

        if(typeof map.portedBy == "number"){
            map.portedBy = getPlayerNameByID(map.portedBy, players);
        }

        return map;
    });

    seasonData.mapPool = mapPool;

    // build Teams
    let teamsFile = fs.readFileSync("data/season-data/Season " + (seasonID + 1) + "/teams.json");
    let teams = JSON.parse(teamsFile);

    // resolve player names
    for(let team of teams){
        let members = [];

        for(let player of team.members){
            members.push(getPlayerNameByID(player, players));
        }

        team.members = members;
        team.captain = getPlayerNameByID(team.captain, players);
        team.secondInCommand = getPlayerNameByID(team.secondInCommand, players);
    }

    seasonData.teams = teams;

    // build Matches
    let scheduleFile = fs.readFileSync("data/season-data/Season " + (seasonID + 1) + "/schedule.json");
    let schedule = JSON.parse(scheduleFile);

    for(let week of schedule){
        for(let match of week){
            match.home = getTeamByID(match.home, teams);
            match.away = getTeamByID(match.away, teams);
        }
    }

    // do other stuff, fetch winner, round score, etc.

    seasonData.matches = schedule;
    seasonData.matchesPerWeek = seasonData.matches[0].length;

    return seasonData;
}

function getPlayerByID(playerID, players){
    for(let player of players){
        if(player.id == playerID){
            return player;
        }
    }

    return false;
}

function getPlayerNameByID(playerID, players){
    for(let player of players){
        if(player.id == playerID){
            return player.name;
        }
    }

    return false;
}

function getTeamByID(teamID, teams){
    for(let team of teams){
        if(team.id == teamID){
            return team;
        }
    }

    return false;
}

function getTeamNameByID(teamID, teams){
    for(let team of teams){
        if(team.id == teamID){
            return team.name;
        }
    }

    return false;
}

/* one team
{
    "id": 1,
    "name": "Team Random",
    "tag": "{RGC}",
    "members": [6, 7, 8, 9],
    "captain": 6,
    "secondInCommand": -1
}
*/