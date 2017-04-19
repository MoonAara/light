var _ = require("underscore"),
    Mesh = require("./mesh"),
    Style = require("./style"),
    Class = require("../../common/class"),
    Links = require("../../common/links");

Editor = module.exports = Class(function(root){
    var T = this;

    T.root = new El(root);

    T.pages = {};    
    T.activepage = T.newpage("Hi"); 
},{
    show: function(page) {
        var T = this,
            old = T.activepage;
        T.activepage.anim({
            duration: .5,
            opacity: 0,
        }, function() {
            old.style({
                display: "none",
            });
            page.style({
                display: "block",
            });
            page.anim({
                duration: .5,
                opacity: 1, 
            });
        });
        T.activepage = page;
    },
    newpage: function(title) {
        var T = this,
            rw = T.root.width(),
            width = Math.min(800, rw),
            margin = (rw - width)/2.0,
            height = T.root.height();

        var page = new Page(title); 
        page.el.style({
            display: "none",
            opacity: 0,
            width: width,
            height: height,
            margin: "0 "+margin+"px",
        });

        T.style.the(page, "text");
        T.style.the(page.title, "title");
        T.style.the(page.context, "context");

        page.el.into(T.root);

        T.show(page);

        return page;
    },
});
