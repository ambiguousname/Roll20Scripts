//Creates a patrolling individual.
//This is timed as of now (to change on a per-turn basis).
//To add more options later
//Requires commandParse.js
//Typical command: !pt <arg1> <arg2>
//arg1 = The name (or name(s)) of the tokens to patrol.
//arg2 = Coordinate pairs. Stylized: x,y:x2,y2:x3,y3
on("ready", function(){
    if(!state.tPatrol){
        state.tPatrol = {
            guards: []
        };
    }
});
function setPatrol(coordArr, guard, ms){
    if(guard.patrol === true){
        var index = 0;
        var prevPos = state.command.parseString(coordArr[0], ",");
        var countUp = true;
        guard.int = window.setInterval(function(){
            if(countUp){
                index += 1;
                if(index >= coordArr.length){
                    index = coordArr.length - 1;
                    countUp = false;
                }
            } else {
                index -= 1;
                if(index < 0){
                    index = 0;
                    countUp = true;
                }
            }
            var coord = state.commandParse.parseString(coordArr[index], ",");
            var dist = [Math.abs(parseInt(coord[0]) - parseInt(prevPos[0])),Math.abs(parseInt(coord[1]) - parseInt(prevPos[1]))];
            guard.set("left", guard.get("left") + dist);
            prevPos = coord;
        }, ms);
    } else {
        window.clearInterval(guard.int);
    }
}
on("chat:message", function(msg){
    if(msg.type === "api" && msg.content.indexOf("!pt ") !== -1){
        var args = state.commandParse.parseString(msg.content, " ");
        var guards = findObjs({name: args[1]});
        guards.forEach(function(g){
            g.patrol = true;
            setPatrol(state.commandParse.parseString(args[2], ":"), g, 1000);
            state.tPatrol.guards.push(g);
        });
    }
});