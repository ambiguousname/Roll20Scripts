//Creates a patrolling individual.
//This is timed as of now (to change on a per-turn basis).
//To add more options later
//Requires commandParse.js
//Typical command: !pt <arg1> <arg2>
//arg1 = The name (or name(s)) of the tokens to patrol.
//arg2 = Coordinate pairs. Stylized: x,y:x2,y2:x3,y3 //Keep in mind, these coordinates are relative to the guard's position. And they start at 0, 0
var tGuards = [];
function distanceToPixels(dist) {
	var PIX_PER_UNIT = 70;
	return PIX_PER_UNIT * dist;
}
on("ready", function(){
    sendChat("Patrol.js", "Patrol.js is online!");
    if(!state.tPatrol){
        state.tPatrol = {
            guards: [],
            turnBased: true,
            ms: 1000
        };
    }
});
function setPatrol(coordArr, guard){
    sendChat("Patrol.js", "Patrol set.");
    sendChat("Patrol.js", "Guard Type: " + guard.get("_type"));
    sendChat("Patrol.js", "Guard Name: " + guard.get("name"));
    // sendChat("Patrol.js", "Guard is patrolling: " + guard.patrol);
    sendChat("Patrol.js", "Guard is at: " + (guard.get("left")/distanceToPixels(1)) + ", " + (guard.get("left")/distanceToPixels(1)) + ".")
    if(guard.patrol === true){
        var prevPos = parseString(coordArr[0], ",");
        var countUp = true;
        if(state.tPatrol.turnBased === false){
            guard.int = setInterval(function(){
                //Increment and decrement index
                var coord = parseString(coordArr[guard.index], ",");
                var dist = [parseInt(coord[0]) - parseInt(prevPos[0]),parseInt(coord[1]) - parseInt(prevPos[1])];
                guard.set("left", guard.get("left") + distanceToPixels(dist[0]));
                guard.set("top", guard.get("top") + distanceToPixels(dist[1]));
                prevPos = coord;
                if(countUp === true){
                    guard.index += 1;
                    if(guard.index > coordArr.length - 2){
                        countUp = false;
                    }
                } else {
                    guard.index -= 1;
                    if(guard.index < 1){
                        countUp = true;
                    }
                }
            }, state.tPatrol.ms);
        }
    }
}
on("change:campaign:turnorder", function(obj) {
    var turn = JSON.parse(Campaign().get("turnorder"));
    if(turn.length > 0){
        tGuards.forEach(function(guard){
            if(guard.get("_id") === turn[0].id && guard.patrol){
                var coord = parseString(guard.coords[guard.index], ",");
                var dist = [parseInt(coord[0], 10) - parseInt(guard.prevPos[0], 10),parseInt(coord[1], 10) - parseInt(guard.prevPos[1], 10)];
                guard.set("left", guard.get("left") + distanceToPixels(dist[0]));
                guard.set("top", guard.get("top") + distanceToPixels(dist[1]));
                guard.prevPos = coord;
                if(guard.countUp === true){
                    guard.index += 1;
                    if(guard.index > guard.coords.length - 2){
                        guard.countUp = false;
                    }
                } else {
                    guard.index -= 1;
                    if(guard.index < 1){
                        guard.countUp = true;
                    }
                }
            }
        });
    }
});
on("chat:message", function(msg){
    if(msg.type === "api" && playerIsGM(msg.playerid)){
        if(msg.content.indexOf("!pt ") !== -1){
            sendChat("Patrol.js", "Analyzing Command...");
            var args = parseString(msg.content, " ");
            var guards = findObjs({name: args[1]});
            sendChat("Patrol.js", "Found " + guards.length + " guard(s) with name " + args[1] + ".");
            _.each(guards, function(g){
                sendChat("Patrol.js", "Guard " + g.get("name") + " found.");
                g.patrol = true;
                g.index = 0;
                g.coords = parseString(args[2], ":");
                g.countUp = true;
                g.prevPos = parseString(g.coords[0], ",");
                tGuards.push(g);
                state.tPatrol.guards.push(g);
                setPatrol(g.coords, g);
                sendChat("Patrol.js", "Creating patrol...");
            });
        } else if (msg.content.indexOf("!stoppt ") !== -1){
            var args = parseString(msg.content, " ");
            var guards = findObjs({name: args[1]});
            sendChat("Patrol.js", "Found " + guards.length + " guard(s) with name " + args[1] + ".");
            _.each(guards, function(g){
                if(state.tPatrol.turnBased){
                    clearInterval(g.int);
                }
                g.patrol = false;
                sendChat("Patrol.js", "Stopping patrol for one guard with name " + args[1] + ".");
            });
        } else if (msg.content.indexOf("!startpt ") !== -1){
            var args = parseString(msg.content, " ");
            var guards = findObjs({name: args[1]});
            sendChat("Patrol.js", "Found " + guards.length + " guard(s) with name " + args[1] + ".");
            _.each(guards, function(g){
                g.patrol = true;
                if(state.tPatrol.turnBased === false){
                    setPatrol(g.coords, g);
                }
                sendChat("Patrol.js", "Starting patrol for one guard with name " + args[1] + ".");
            });
        } else if (msg.content.indexOf("!clearpt ") !== -1){
            var args = parseString(msg.content, " ");
            var guards = findObjs({name: args[1]});
            sendChat("Patrol.js", "Found " + guards.length + " guard(s) with name " + args[1] + ".");
            _.each(guards, function(g){
                if(state.tPatro.turnBased === false){
                    clearInterval(g.int);
                }
                tGuards.splice(tGuards.indexOf(g), 1);
                state.tPatrol.guards.splice(state.tPatrol.guards.indexOf(g), 1);
                g = null;
                log(state.tPatrol.guards);
                sendChat("Patrol.js", "Clearing patrol for one guard with name " + args[1] + ".");
            });
        } else if (msg.content.indexOf("!initpt ") !== -1){
            var args = parseString(msg.content, " ");
            if(args[1] == true){
                state.tPatrol.turnBased = true;
            } else if (args[1] == false) {
                state.tPatrol.turnBased = false;
                if(args[2]){
                    state.tPatrol.ms = args[2];
                }
            }
            sendChat("Patrol.js", "Patrol is turn based: " + state.tPatrol.turnbased);
        }
    }
});