var _ = require("underscore"),
    Mesh = require("./mesh"),
    Style = require("./style"),
    Class = require("../../common/class"),
    //Base = require("../../server/Base"),
    Links = require("../../common/links");

Editor = module.exports = Class(function(root, authorid){
    var T = this;

    // Moonlight
    T.mesh = new Mesh(root);

    T.pages = {};    
    T.activepage = T.newpage(); 

    T.style = new Style({
        text: {
            font: "Lustria",
        },
        title: {
            font: "Cinzel",
        },
        context: {
            font: "Cinzel",
        },
        presets: {
            code: {
                font: "Inconsolata",   
            }
        },
    });

},{
    newpage: function() {
        var T = this,
            the = T.mesh,
            width = Math.min(800,the.html.width()),
            excess_width = the.html.width() - width,
            margin = excess_width/2.0,
            height = the.html.height();

        var page = the.block({
                x: margin,
                y: 0,
                width: width,
                height: height,
            },{
                addClass: "her-page",
            }),

            grid = the.grid(width, height, {
                into: page,
            });
        
        return page;
    },
    addfragment: function(type) {
        var fragment = T.fragments.add([T, type]);    
        // TODO database
        return fragment;
    }
});
