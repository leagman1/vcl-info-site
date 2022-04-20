const fs = require("fs");
const util = require("./util");

module.exports = function buildSeasonData(seasonID){
    seasonID = Number(seasonID);

    let seasonData = {};

    // get Season
    let seasonFilePath = "data/seasons.json";
    let seasons = false;

    if(fs.existsSync(seasonFilePath)){
        let seasonFile = fs.readFileSync(seasonFilePath);
        seasons = JSON.parse(seasonFile);

        seasonData.totalSeasons = seasons.length;

        for(let season of seasons){
            if(season.id == seasonID){
                seasonData.selectedSeason = season;
            }
        }
    }

    // get Players
    let playerPath = "data/players.json";
    let players = false;

    if(fs.existsSync(playerPath)){
        let playersFile = fs.readFileSync(playerPath);
        players = JSON.parse(playersFile);
    }

    // build Map Pool
    let mapsPath = "data/maps.json";
    let mapPool = false;

    if(fs.existsSync(mapsPath)){
        let mapFile = fs.readFileSync(mapsPath);
        let allMaps = JSON.parse(mapFile);

        mapPool = allMaps.filter(function(map){
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
    }

    seasonData.mapPool = mapPool;

    // build Teams
    let teamsFilePath = "data/season-data/Season " + (seasonID + 1) + "/teams.json";
    let teams = false;

    if(fs.existsSync(teamsFilePath)){
        let teamsFile = fs.readFileSync(teamsFilePath);
        teams = JSON.parse(teamsFile);

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
    }

    // build Matches
    let scheduleFilePath = "data/season-data/Season " + (seasonID + 1) + "/schedule.json";
    let schedule = false;

    if(fs.existsSync(scheduleFilePath)){
        let scheduleFile = fs.readFileSync(scheduleFilePath);
        schedule = JSON.parse(scheduleFile);

        schedule.forEach(function iterateOverWeeks(matches, weekIndex){
            matches.forEach(function iterateOverMatches(match, matchIndex){
                match.home = Object.create(util.getTeamByID(match.home, teams));
                match.away = Object.create(util.getTeamByID(match.away, teams));
    
                try {
                    let matchResultsFilePath = "data/season-data/Season " + (seasonID + 1) + "/Match data/Week " + (weekIndex + 1) + "/Match " + (matchIndex + 1) + "/match-results.json";
                    if(fs.existsSync(matchResultsFilePath)){
                        let matchResultsFile = fs.readFileSync(matchResultsFilePath);
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
                    }
                } catch (err) {
                    // console.log("ERROR", err);
                }
            });
        });
    }
    
    // get team aliases for parsing custom result files
    let teamAliasFilePath = "data/season-data/Season " + (seasonID + 1) + "/teamAliases.json";
    let teamAliases = false;

    if(fs.existsSync(teamAliasFilePath)){
        let teamAliasFile = fs.readFileSync(teamAliasFilePath);
        teamAliases = JSON.parse(teamAliasFile);
    }
    
    seasonData.teamAliases = teamAliases;

    seasonData.matches = schedule;
    if(schedule)
        seasonData.matchesPerWeek = seasonData.matches[0].length;

    return seasonData;
}