module.exports = {
    getPlayerByID: getPlayerByID,
    getPlayerNameByID: getPlayerNameByID,
    getTeamByID: getTeamByID,
    getTeamNameByID: getTeamNameByID,
    resolvePlayerAlias: resolvePlayerAlias,
    isPlayerInTeam: isPlayerInTeam
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

function resolvePlayerAlias(playerAlias, allAliases){
    return allAliases[playerAlias] || false;
}

function isPlayerInTeam(playerID, team){
    return team.members.some((player) => player.id == playerID);
}