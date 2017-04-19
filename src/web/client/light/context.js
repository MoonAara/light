var _ = require("underscore"),
    Class = require("../../common/class"),
    //Base = require("../../server/Base"),

Context = module.exports = Class(function(page) {

    var T = this;

    T.pages = [];

    T.el = new El({
        into: page.el,
        addClass: "her-context",    
    });

    T.list = new List(El);
},{
    add: function(page, before) {
        var T = this;
        T.pages.push(page);
        var item = T.list.add(["span", {
            attr: {
                "data-link": page.id,
            }
        });

        T.el.insert(item, before);
    },
});
