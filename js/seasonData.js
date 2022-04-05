const fs = require("fs");
const util = require("./util");

module.exports = function buildSeasonData(seasonID){
    seasonID = Number(seasonID);

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
            map.creator = util.getPlayerNameByID(map.creator, players);
        }

        if(typeof map.portedBy == "number"){
            map.portedBy = util.getPlayerNameByID(map.portedBy, players);
        }

        return map;
    });

    seasonData.mapPool = mapPool;

    // build Teams
    let teamsFile = fs.readFileSync("data/season-data/Season " + (seasonID + 1) + "/teams.json");
    let teams = JSON.parse(teamsFile);

    // resolve players
    for(let team of teams){
        let members = [];

        for(let player of team.members){
            members.push(util.getPlayerByID(player, players));
        }

        team.members = members;
        team.captain = util.getPlayerByID(team.captain, players);
        team.secondInCommand = util.getPlayerByID(team.secondInCommand, players);
    }

    seasonData.teams = teams;

    // build Matches
    let scheduleFile = fs.readFileSync("data/season-data/Season " + (seasonID + 1) + "/schedule.json");
    let schedule = JSON.parse(scheduleFile);

    schedule.forEach(function iterateOverWeeks(matches, weekIndex){
        matches.forEach(function iterateOverMatches(match, matchIndex){
            match.home = Object.create(util.getTeamByID(match.home, teams));
            match.away = Object.create(util.getTeamByID(match.away, teams));

            try {
                let matchResultsFile = fs.readFileSync("data/season-data/Season " + (seasonID + 1) + "/Match data/Week " + (weekIndex + 1) + "/Match " + (matchIndex + 1) + "/match-results.json");
                matchResults = JSON.parse(matchResultsFile);

                match.home.roundsWon = 0;
                match.away.roundsWon = 0;

                matchResults.forEach(function getMatchScores(round, index){
                    if(round.home.score > round.away.score){
                        match.home.roundsWon++;
                    } else {
                        match.away.roundsWon++;
                    }
                });

                match.home.score = matchResults.home.score;
                match.away.score = matchResults.away.score;

                match.winner = match.home.roundsWon > match.away.roundsWon ? "home" : "away";
            } catch (err) {
                // console.log("ERROR", err);
            }
        });
    });

    // do other stuff, fetch winner, round score, etc.

    seasonData.matches = schedule;
    seasonData.matchesPerWeek = seasonData.matches[0].length;

    return seasonData;
}