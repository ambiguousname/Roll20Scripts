//Creates a patrolling individual.
//This is timed as of now (to change on a per-turn basis).
//To add more options later
//Requires commandParse.js
//Typical command: !pt <arg1> <arg2>
//arg1 = The name (or name(s)) of the tokens to patrol.
//arg2 = Coordinate pairs. Stylized: x,y:x2,y2:x3,y3
on("ready", function(){
    sendChat("Patrol.js", "Patrol.js is online!");
    if(!state.tPatrol){
        state.tPatrol = {
            guards: []
        };
    } else {
        state.tPatrol.guards.forEach(function(guard){
            clearInterval(guard.int);
        });
    }
});
function setPatrol(coordArr, guard, ms){
    sendChat("Patrol.js", "Patrol set.");
    sendChat("Patrol.js", "Guard Type: " + guard.get("_type"));
    sendChat("Patrol.js", "Guard Name: " + guard.get("name"));
    sendChat("Patrol.js", "Guard is patrolling: " + guard.patrol);
    if(guard.patrol === true){
        var index = 0;
        var prevPos = parseString(coordArr[0], ",");
        var countUp = true;
        guard.int = setInterval(function(){
            //Increment and decrement index
            var coord = parseString(coordArr[index], ",");
            var dist = [parseInt(coord[0]) - parseInt(prevPos[0]),parseInt(coord[1]) - parseInt(prevPos[1])];
            guard.set("left", guard.get("left") + dist[0]);
            guard.set("top", guard.get("top") + dist[1]);
            prevPos = coord;
            if(countUp === true){
                index += 1;
                if(index > coordArr.length - 2){
                    countUp = false;
                }
            } else {
                index -= 1;
                if(index < 1){
                    countUp = true;
                }
            }
        }, ms);
        guard.patrol = false;
    } else {
        window.clearInterval(guard.int);
    }
}
on("chat:message", function(msg){
    if(msg.type === "api" && msg.content.indexOf("!pt ") !== -1){
        sendChat("Patrol.js", "Analyzing Patrol Pattern...");
        var args = parseString(msg.content, " ");
        var guards = findObjs({name: args[1]});
        sendChat("Patrol.js", "Found " + guards.length + " guard(s) with name " + args[1] + ".");
        _.each(guards, function(g){
            sendChat("Patrol.js", "Guard " + g.get("name") + " found.");
            g.patrol = true;
            log(args);
            setPatrol(parseString(args[2], ":"), g, 1000);
            sendChat("Patrol.js", "Setting Parameters...");
            state.tPatrol.guards.push(g);
        });
    }
});