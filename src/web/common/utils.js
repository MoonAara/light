var _ = require("underscore"),
    Class = require("./class");

var El = require("../client/core/el"),
    debug = new El("#debug");
debug.style({
    top: (window.innerHeight - 50) + 'px',
});

module.exports = (function () { return {
    log: function(text) {
        console.log(text ? text : "here");
        debug.html(text); 
    },
    // a concise summary of everything wrong with javascript:
    remap: function(obj, map) {
        var result = {};
        _.each(map, function(name, original) {
            var parts = original.split('.'),
                set = _.clone(obj),
                pl = parts.length - 1.
                last = parts[pl];
            for(var i = 0, l = pl; i < l; i++) {
                set = set[parts[i]];
                if(!set) return;
            }
            if(set[last]) result[name] = set[last];    
        });
        return result;  
    },
}})();
