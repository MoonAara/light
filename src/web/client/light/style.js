var _ = require("underscore"),
    webfont = require("../ext/webfont"),
    Class = require("../../common/class"),
    El = require("../core/el");

var loadfonts = function(set) {
    var T = this;
    _.each(set, function(options) {
        T.font(options.font);
    });
};

// uses Google Fonts to print letter blocks
Style = module.exports = Class(function(setting) {
    var T = this;

    T.mode = "standard";
    T.setting = setting;

    T.fonts = {};

    // load fonts
    _.each(setting.modes, function(mode) {
        loadfonts.call(T, mode);
    });
    loadfonts.call(T, setting.presets);

    T.focus = null;
    T.el = new El("div", {
        addClass: "her-style",
        style: {
            display: "none",
        }
    });
    
    T.map = {}; // keep track of all styled els
    T.void = new El("#void");
},{
    the: function(el, style) { // style this el according to current mode
        var T = this,
            setting = T.setting.modes[T.mode][style],
            list = T.map[style];
        T.like(el, setting);

        if(Array.isArray(list)) {
            T.map[style].push(el);
        } else {
            T.map[style] = [el];
        }
    },
    // apply css rules, but like, with shorter names in setting
    like: function(el, setting) {
        var T = this,
             opts = {
                //fontFamily: setting.family ? setting.family : setting.font,
                fontFamily: setting.font,
                fontSize: setting.size,
                backgroundColor: setting.bg,
                color: setting.fg,
                padding: setting.pad,
                border: setting.border,
                borderRadius: setting.rounding+'px',
            };
        _.each(setting.bi, function(letter) {
            switch(letter) {
                case 'b': opts.fontWeight = "bold"; break;
                case 'i': opts.textDecoration = "italic"; break;
            }
        });
            
        el.style(opts);
    },
    all: function() { // update the styles of all the els
        var T = this,
            settings = T.setting.modes[T.mode];
        _.each(settings, function(setting, name) {
            _.each(T.map[name], function(el) {
                T.like(el, setting);
            });
        });
    },
    change: function(style, setting) {
        var T = this,
            set = T.setting.mode[T.mode][style];
        _.extend(T.setting[style], setting);
        
        _.each(T.map[style], function(el) {
            T.like(el, set);
        });
    },
    mode: function(mode) {
        var T = this;
        T.mode = mode;
        T.all();
    },
    font: function(family, provider) {
        if(!family) return;

        var T = this;

        if(!T.fonts[family]) {
            var fontprovider = provider ? provider : "google";

            var req = {};
            req[fontprovider] = {
                families: [family],
            };
            webfont.load(req);
            T.fonts[family] = fontprovider;
        }
    },
    scalefont: function(el, style, to) { // used to scale fonts to a certain width
        var T = this,
            height = el.height(),
            span = new El("span", {
                html: el.text(),
                into: T.void,
            });
        T.the(span, "title");
        
        var width = span.width();
            scale = to/width;
            ideal = height * scale,
            i = 0;
        do {
            // font size doesn't scale to width consistently
            // so decrease gradually until it's right
            // TODO that smarter way we learned in school
            span.style({
                fontSize: ideal+'px',
            });
            ideal *= 0.97; 
            i++;
        } while(span.width() > to);
        console.log(i);
        el.style({
            fontSize: ideal+'px',
        });
        console.log(width, height, scale, ideal, el);

        T.clearvoid();
    },
    scaleimg: function(el, to) { // used to scale images to a certain height
        var width = el.width(),
            height = el.height(),
            scale = to/height,
            ideal = Math.floor(width * scale);

        el.style({
            width: ideal+'px',
        });
    },
    clearvoid: function() {
        var v = this.void;
        while (v.firstChild) {
            v.removeChild(v.firstChild);
        }
    },
});
