var Class = require("../../common/class"),
    color = require("./color");
    
Light = module.exports = Class(function(source) {
    var T = this;

    T.source = source ? source : {
        color: color.of("0,0,0"),
        place: T.xy(0,0),   
    };

    T.focus = source;
},{
    branch: function(n) {
        
    },
    back: function() {

    },
    forward: function() {

    },
    up: function() {

    },
    down: function() {
                
    },
});
