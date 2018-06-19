//Automatically manages combat.
//Designed for open area combat.
function addTurn(token, to, sheet){
    to.push({"id": t._id, "pr": (Math.floor(Math.random() * 21) + 1) + parseInt(getAttrByName(sheet.id, "initiative_bonus")), "name": token.attributes.name});
}
function addEnemies(tokens){
    var to = JSON.parse(Campaign().get('turnorder'));
    log("ToStart");
    if(tokens){
        tokens.forEach(function(t){
            var token = getObj("graphic", t._id);
            var sheet = getObj("character", token.attributes.represents);
            addTurn(token, to, sheet);
            token.type = "enemy";
            state.tCombat.players.push(token);
        });
    }
    to = _.sortBy(to, function(num){return num});
    Campaign().set('turnorder', JSON.stringify(to));
    state.tCombat.units = state.tCombat.players.concat(state.tCombat.enemies, state.tCombat.misc);
    sendChat("Combat.js", "/w gm Finished setup!");
}
function initializeCombat(){
    state.tCombat = {
        players: [],
        enemies: [],
        misc: [],
        units: [],
        isEnabled : true,
        unitSize: 5
    };
}
on("ready", function(){
    if(!state.tCombat){
        initializeCombat();
    }
});
function instantiateCombat(tokens){
    var to = JSON.parse(Campaign().get('turnorder'));
    if(tokens){
        tokens.forEach(function(t){
            var token = getObj("graphic", t._id);
            var sheet = getObj("character", token.attributes.represents);
            addTurn(token, to, sheet);
            token.type = "player";
            state.tCombat.players.push(token);
        });
    }
    to = _.sortBy(to, function(num){return num});
    Campaign().set('turnorder', JSON.stringify(to));
}
on("chat:message", function(msg){
    if(playerIsGM(msg.playerid)){
        var command = parseString(msg.content, " ");
        if(command[0] === "!combat"){
            if (command[1] === "set" && command[2] === "players"){
                sendChat("Combat.js", "/w gm Setting players...");
                instantiateCombat(msg.selected);
            } else if (command[1] === "clear"){
                sendChat("Combat.js", "/w gm Resetting script...");
                initializeCombat();
            } else if (command[1] === "settings") {
                sendChat("Combat.js", "/w gm Modifying settings...");
                if(command[2] === "true"){
                    state.tCombat.isEnabled = true;
                } else if (command[2] === "false"){
                    state.tCombat.isEnabled = false;
                }
                if(command[3]){
                    if(!isNaN(command[3])){
                        state.tCombat.unitSize = parseInt(command[3]);
                    }
                }
                sendChat("Combat.js", "/w gm Settings: isEnabled: " + state.tCombat.isEnabled + ", unitSize: " + state.tCombat.unitSize);
            } else if(command[1] === "set" && command[2] === "enemies"){
                sendChat("Combat.js", "/w gm Setting enemies...");
                addEnemies(msg.selected);
            } else if (command[1] === "set" && command[2] === "misc"){
                sendChat("Combat.js", "/w gm Setting misc. fighters...");
                if(msg.selected){
                    var to = JSON.parse(Campaign().get("turnorder"));
                    msg.selected.forEach(function(t){
                        var token = getObj("graphic", t._id);
                        var sheet = getObj("character", token.attributes.represents);
                        addTurn(token, to, sheet);
                        token.type = "misc";
                        state.tCombat.misc.push(token);
                    });
                }
            } else {
                sendChat("Combat.js", "/w gm Commands: set [players, enemies, misc], settings [isEnabled] [unitSize], clear");
            }
        }
    }
});
function distanceToPixels(dist) {
	var PIX_PER_UNIT = 70;
	return PIX_PER_UNIT * dist;
}
function getDist(object1, object2){
    return Math.sqrt((object2.get("left") - object1.get("left"))^2 + (object2.get("up") - object1.get("up"))^2);
}
function calculateMove(list, token){
    var closest = list[0];
    var closestDist = Math.abs(getDist(unit, list[0]));
    if(!token.target){
        list.forEach(function(player, index){
            if(Math.abs(getDist(unit, player)) < closestDist && getAttrByName(player.attributes.represents, "hp") > 0){
                token.target = player;
            } else if(getAttrByName(player.attributes.represents, "hp") <= 0){
                list.splice(index, 1);
            }
        });
    } else if (getAttrByName(token.target.attributes.represents, "hp") <= 0){
        token.target = null;
        calculateMove(list, token);
    } else {
        //If the enemy has a target.
        var speedE = getAttrByName(token.attributes.represents, "npc_speed");
        var newString = "";
        speedE.forEach(function(n){
            if(!isNaN(parseInt(n))){
                newString += n;
            }
        });
        speedE = parseInt(newString);
        if(isNaN(speedE)){
            speedE = 0;
        }
        //Not gonna include pathfinding...
        //Yet...
        //https://www.redblobgames.com/pathfinding/a-star/introduction.html
        var pixelsToGo = distanceToPixels(speedE/state.tCombat.unitSize);
        while(pixelsToGo > 0){
            if(token.get("up") > token.target.get("up") + 70){
                token.set("up", token.get("up") - 70);
            } else if (token.get("up") < token.target.get("up") - 70){
                token.set("up", token.get("up") + 70);
            }
            if(token.get("left") > token.target.get("left") + 70){
                token.set("left", token.get("left") - 70);
            } else if (token.get("left") < token.target.get("left") - 70){
                token.set("left", token.get("left") + 70);
            }
            pixelsToGo -= 70;
        }
    }
}
on("change:campaign:turnorder", function(obj){
    var turn = JSON.parse(Campaign().get("turnorder"));
    if(turn.length > 0 && state.tCombat.isEnabled){
        state.tCombat.units.forEach(function(unit){
            turn.forEach(function(turnU, index){
                if(turnU._id === unit._id){
                    switch(unit.type){
                        case 'player':
                            sendChat("Game Master", unit.get("name") + ", it is your turn.");
                            break;
                        case 'enemy':
                            //Do some AI stuff.
                            calculateMove(state.tCombat.players, unit);
                            break;
                    }
                }
            });
        });
    }
});