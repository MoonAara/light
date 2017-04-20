var _ = require("underscore"),
    Page = require("./page"),
    Style = require("./style"),
    El = require("../core/el"),
    Class = require("../../common/class"),
    Links = require("../../common/links"),
    config = require("./config");

Editor = module.exports = Class(function(root){
    var T = this;

    T.root = new El(root);
    T.style = new Style(config.style); 

    T.pages = {};    
    var context = [T.newpage("light"),
        T.newpage("composition"),
        T.newpage("work")],
    home = T.newpage("AARA"); 

    var firstline = home.newline();

    _.each(context, function(page) {
        home.context.add(page);
    }); 

    setTimeout(function() {
        T.show(home);
        home.activate(firstline);
    }, 1000);

},{
    show: function(page) {
        var T = this,
            old = T.activepage,
            pagel = page.el;
        if(old) {
            old.el.anim({
                duration: 500,
                opacity: 0,
            }, function() {
                old.el.style({
                    display: "none",
                });
                pagel.style({
                    display: "block",
                });
                pagel.anim({
                    duration: 500,
                    opacity: 1, 
                });
            });
        } else {
            pagel.style({
                display: "block",
            });
            pagel.anim({
                duration: 1000,
                opacity: 1, 
            });
        }
        T.activepage = page;
        console.log("showed ", page);
    },
    width: function() {
        return Math.min(800, this.root.width());
    },
    newpage: function(title) {
        var T = this,
            rw = T.root.width(),
            width = T.width(),
            margin = (rw - width)/2.0,
            height = T.root.height();

        var page = new Page(title),
            pagel = page.el; 

        pagel.style({
            display: "none",
            opacity: 0,
            width: width,
            height: height,
            margin: "0 "+margin+"px",
        });

        T.style.the(pagel, "text");
        T.style.the(page.title.el, "title");
        T.style.the(page.context.el, "context");

        pagel.into(T.root);

        return page;
    },
});
