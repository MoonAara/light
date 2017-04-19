var Class = require("../../common/class");

color = module.exports = (function () { return {
    hex: function(value) {
        return parseInt(value, 16);
    },
    of: function(string) {
        var c = {};
        if(string[0] = '#') {
            c.r = T.hex(string.slice(0,1));
            c.g = T.hex(string.slice(2,3));
            c.b = T.hex(string.slice(4,5));
        } else {
            var colors = string.split(',');
            c.r = colors[0];
            c.g = colors[1];
            c.b = colors[2];
        }
        return c;
    },
})();
