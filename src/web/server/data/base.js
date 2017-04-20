var Class = require("../common/class");

Base = module.exports = Class(function(text, data) {
    var T = this;

    T.ids = 0;
    T.db = {};
},{
    type: function(text) {
        var T = this; 
    },
    save: function(text, oldid) {
        var T = this,
            id = oldid ? oldid : T.ids++;

        T.db[id] = text;
        return id;    
    },
    load: function(id) {
        var T = this;

        return T.db[id];
    },
});
