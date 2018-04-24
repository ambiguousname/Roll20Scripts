//Simple thing for parsing commands
//As of now, arguments have to be separated by one special character. There can't be multiple special characters.
var parseString;
var parseQString;
on("ready", function(){
    parseString = function(string, specialChar){
        var args = [];
        var argString = "";
        for(var i in string){
            var char = string[i];
            log(string.length);
            var append = "";
            if(char === "\'" || char === "\""){
                //Hope this works. Might have to change it.
                append = "\\";
            }
            if(char === specialChar){
                args.push(argString);
                argString = "";
            } else if (parseInt(i) === string.length - 1){
                log(i);
                argString += append + char;
                args.push(argString);
            } else {
                argString += append + char;
            }
        }
        return args;
    }
    //Too lazy to rename stuff.
    parseQString = function(string, specialChar){
        var fullStr = "";
        var nString = "";
        for(var i in string){
            var char = string[i];
            var append = "";
            if(char === "\'" || char === "\""){
                //Hope this works. Might have to change it.
                append = "\\";
            }
            if(char === specialChar){
                fullStr += argString;
                argString = "";
            } else if (parseInt(i) === string.length - 1){
                argString += append + char;
                fullStr += argString;
            } else {
                argString += append + char;
            }
        }
    }
});