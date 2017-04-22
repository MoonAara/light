var _ = require("underscore"),
    webfont = require("../ext/webfont"),
    u = require("../../common/utils"),
    Class = require("../../common/class"),
    El = require("../core/el");

var loadfonts = function(set) {
    var T = this;
    _.each(set, function(options) {
        T.font(options.font);
    });
};

Style = module.exports = Class(function(setting) {
    var T = this;

    T.mode = "standard";
    T.setting = setting;
    T.active = T.setting.modes[T.mode];

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
    // style this el according to current mode
    // and keep track of it so that 
    // when settings change this will get updated
    layer: function(el, style) { 
        var T = this,
            setting = T.active[style],
            list = T.map[style];

        T.like(el, setting);

        if(Array.isArray(list)) {
            T.map[style].push(el);
        } else {
            T.map[style] = [el];
        }
        el.styling = style;
    },
    unlayer: function(el, style) {
        el.styling = 
        var layers = _.filter(el.styling, function(layer) {
            return layer.strip() !== style;
        });
        var i = _.findIndex(T.map[style], function(styled) {
            return styled.id === el.id; 
        });
        delete T.map[style][i];
    },
    reapply: function(el) {
        _.each(el.styling.split(','), function(style) {
            T.like(el, T.active[style]);
        });
    },
    // transition 
    // 'to' a style set under trans
    // in the style config
    // with 'milli' duration
    trans: function(el, to, cb) {
        var T = this,
            style = el.styling,
            set = T.active[style].trans[to],
            opts = T.format(set);
        el.anim(opts, cb);        
    },
    format: function(setting) {
        var set = setting,
            init = set.start;
        if(init) {
            _.extend(set, setting.trans[init]);
        }
        return u.remap(set, {
            fontFamily: "font",
            fontSize: "size",
            backgroundColor: "bg",
            color: "fg",
            padding: "pad",
            margin: "margin",
            display: "as",
            border: "box",
            borderColor: "border.color",
            borderWidth: "border.width",
            borderRadius: "border.radius",
            borderStyle: "border.style",
            duration: "milli",
        });
    },
    // apply css rules, but like, with shorter names in setting
    like: function(el, setting) {
        var T = this,
             opts = T.format(setting);
        _.each(setting.bi, function(letter) {
            switch(letter) {
                case 'b': opts.fontWeight = "bold"; break;
                case 'i': opts.textDecoration = "italic"; break;
            }
        });
            
        console.log(opts);
        el.style(opts);
    },
    all: function() { // update the styles of all the els
        var T = this;
        _.each(T.active, function(setting, name) {
            _.each(T.map[name], function(el) {
                T.like(el, setting);
            });
        });
    },
    change: function(style, setting) {
        var T = this;
        _.extend(T.active[style], setting);
        
        _.each(T.map[style], function(el) {
            T.like(el, T.active[style]);
        });
    },
    mode: function(mode) {
        var T = this;
        T.mode = mode;
        T.active = T.settings.modes[mode];
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
            span = new El("span", {
                html: el.text(),
                into: T.void,
            });
        T.the(span, style);
        
        var scale = to/span.width(),
            ideal = span.height() * scale,
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
        el.style({
            fontSize: ideal+'px',
        });

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
    css: function(selector, rule) {
        var sheet = document.styleSheets[0],
            // choose correct names in case of IE8
            rules = sheet.cssRules ? sheet.cssRules : sheet.rules,
            insert = sheet.insertRule ? "insertRule" : "addRule";

        sheet[insert](selector + ' {' + rule + '}', rules.length);
    },
    clearvoid: function() {
        var v = this.void;
        while (v.firstChild) {
            v.removeChild(v.firstChild);
        }
    },
    selected: function() {
        var T = this,
            range = window.getSelection().getRangeAt(0),
            node = range.extractContents(),
            text = node.textContent,
            span = new El("span");

        span.html(text);

        T.focus = span;
        T.el.insert(span);
        
        range.insertNode(T.el);

        return span;
    },
});
