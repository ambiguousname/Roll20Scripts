//Simple thing for parsing commands
//As of now, arguments have to be separated by one special character. There can't be multiple special characters.
on("ready", function(){
    state.commandParse = {
        parseString: function(string, specialChar){
            var args = [];
            var argString = "";
            for(var i in string){
                var char = string[i];
                var append = "";
                if(char === "\'" || char === "\""){
                    //Hope this works. Might have to change it.
                    append = "\\";
                }
                if(char === specialChar){
                    args.push(argString);
                    argString = "";
                } else if (i === string.length - 1){
                    argString += append + char;
                    args.push(argString);
                } else {
                    argString += append + char;
                }
            }
            return args;
        }
    };
});