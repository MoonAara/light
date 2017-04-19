var _ = require("underscore"),
    Class = require("../../common/class"),
    El = require("../core/el");

Link = module.exports = Class(function(page, linktext, linkpage) {
    var T = this;

    T.up = true;

    T.p1 = new El(page);
    T.p2 = new El(another);

    linktext.on({
        click: function(ev) {
            T.down();
        },
    });
},{
    up: function() {
        T.change(p1, p2);
    },
    down: function() {
        T.change(p2, p1);
        p2.context(p1);
    },
    title: function() {
    },
    
    /////////////////////////////
    // private functions
    /////////////////////////////

});
