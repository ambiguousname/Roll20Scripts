on('ready', function(){
    var version = 0.01;
    if(state.testChar){
        if(state.testChar.v !== version){
            state.testChar.char.graphic.remove();
            state.testChar.char.char.remove();
            state.testChar = null;
        }
    }
    if(!state.testChar){
        var ronald = createObj("character", {
            name: "Ronald the Stupid"
        });
        var graphic = createObj("graphic", {
            represents: ronald._id,
            name: "Ronald",
            showname: true,
            
        });
        ronald.graphic = graphic;
        state.testChar = {char: ronald, v: version};
    }
});