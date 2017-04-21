var Class = require("./class");

Word = module.exports = Class(function(start, end) {
    var T = this;

    T.start = T.parse(start);
    T.end = T.parse(end);
},{
    parse: function(selection) {
        var parts = selection.split('|'),
            result = {
                word: parts[0];   
            };
        if(parts.length > 1) {
            result.letter = parts[1];
        }
        return result;
    },
});
