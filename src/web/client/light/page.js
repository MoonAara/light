var _ = require("underscore"),
    Class = require("../../common/class"),
    List = require("../../common/list"),
    El = require("../core/el");

Page = module.exports = Class(function(title) {
    var T = this;
    
    T.el = new El("div");
    T.context = new Context(T.el);     
    T.title = { 
        text: title,
        el: new El({
            into: T.el,
            addClass: "her-title",
            html: title,
            attr: {
                "data-placeholder": "Title",
                contenteditable: "true",
            }
        })
    };
    T.lines = new List(El);
},{
    newline: function(before) {
        var T = this,
            line = T.lines.add(["div", {
            addClass: "her-line",
            editable: true,
        }], before);

        T.el.insert(line, before);
    },
});
