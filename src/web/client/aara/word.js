var _ = require("underscore"),
    webfont = require("../ext/webfont"),
    Class = require("../../common/class"),
    El = require("../core/el"),
    Mesh = require("../core/mesh");

var fontload = new Fonts();

// uses Google Fonts to print letter blocks
Word = module.exports = Class(function(mesh, options) {
    var T = this,
        opts = _.defaults(options, {
            height: 13,
            font: "Lustria",
        });

    T.height = opts.height,

    T.fonts = {};
    T.fontfamily = T.font(opts.font);
    
    T.mesh = mesh;
},{
    print: function(letter) {
        var T = this,
            block = T.mesh.block({
                top: tl.y,
                left: tl.x,
                height: T.height,
            });
        T.mesh.write(block, letter, {
            font: T.fontfamily,
            size: T.height,   
            style: T.style,
        });
        return block;
    },
    style: function(styling) { // something like "bold italic"
        this.style = styling;
    },
    font: function(family, provider) {
        var T = this;

        if(_.contains(T.fonts, family)) {
            T.fontfamily = family;
        } else {
            fontprovider = provider ? provider : "google",

        if(!T.fonts[family]) {
            var req = {};
            req[provider] = {
                families: [fontfamily],
            };
            webfont.load(req);
            T.fonts[family] = provider;
        }
        return family;
    },
    animate: function(time) {
        var T = this;

        T.t = time - T.time;
        T.time = time;

        _.each(T.moving, function(seeker) {
            T.update(seeker);
        });
        _.each(T.movingpins, function(pin) {
            T.drawpin(pin);
        });

        _.each(T.redraw, function(flag, id) {
            console.log(id);
            var shape = T.shapes[id];
            switch(id[0]) {
                case 'b': T.drawblock(shape); break;
                case 'c': T.drawcircle(shape); break;
            }
            delete T.redraw[id];
        });

        window.requestAnimationFrame(T.animate.bind(T));
    },
});


