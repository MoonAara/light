var _ = require("underscore"),
    Color = require("color"),
    Class = require("../../common/class");

var Colors = module.exports = Class(function() {
    
},{
    // returns a function to darken/lighten a color
    // based on whether the original color is dark or light
    shift_color_f: function(color) {
        var T = this;
        if(Color(color).light()) {
            return function(modifier) { 
                return Color(color).darken(modifier);
            };
        } else {
            return function(modifier) { 
                return Color(color).lighten(modifier);
            };
        }
    },
});
