var _ = require("underscore"),
    El = require("../core/el"),
    Class = require("../../common/class"),
    List = require("../../common/list"),
    //Base = require("../../server/Base"),

Context = module.exports = Class(function(page) {

    var T = this;

    T.page = page;
    T.pages = [];

    T.el = new El("div", {
        into: page.el,
        addClass: "her-context",    
    });

    T.list = new List(El);
},{
    add: function(page, before) {
        var T = this;
        T.pages.push(page);
        var item = T.list.add(["span", {
            html: page.title.text,
            attr: {
                "data-link": page.id,
            },
            addClass: "her-link",
        }]);
        T.el.insert(item, before);
        T.page.style.the(item, "context");
    },
});
