// Moon Aara, 2017+

var _ = require("underscore"), 
    El = require("../core/el"),
    Editor = require("./editor"),
    Class = require("../../common/class");


_.each("Class,El,Editor,_".split(','), function(klass) {
    eval("if(!window."+klass+") window."+klass+"="+klass+";");    
});
