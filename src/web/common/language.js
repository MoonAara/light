var Class = require("./class"),
    Dictionary = require("./dictionary");

Language = module.exports = Class(function() {
    var T = this;
    T.dict = new Dictionary();
},{
    define: function(codephrase, definition) {
        var T = this,
            code = T.dict.getcode(
            phrase = [codephrase,defition].join(":");
        return T.dict.register(phrase);    
    },
    lookup: function(codephrase) {
        var T = this,
            definition = T.dict.lookup(codephrase, {
                fields: "text"
            }),
            parts = definition.text.split(':');

        return parts[1];
    },
    count: function(codephrase) {},
    redefine: function(codephrase, definition) {},

    //////////////////////
    // private functions 
    //////////////////////

});
