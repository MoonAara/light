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
    
var sheet = document.styleSheets[0],
    // choose correct names in case of IE8
    rules = sheet.cssRules ? "cssRules" : "rules",
    insert = sheet.insertRule ? "insertRule" : "addRule";

Style = module.exports = Class(function(setting) {
    var T = this;

    T.mode = "standard";
    T.setting = setting;
    T.active = T.setting.modes[T.mode];
    
    T.map = {}; // css rules
    T.sheet = document.createElement("style");
    T.nextrule = T.sheet[rules].length;

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

    T.void = new El("#void");
},{
    css: function(style, selector) {
        var T = this,
            name = ".+...
            entry = T.map[selector];
        if(!entry) {
            entry = T.nextrule++;
            T.map[selector] = entry;
        }
            
        sheet[insert](selector + T.format(style), entry);
        _.each(style.states, function(state, name) {
            T.css(selector+    
        });
    },
    mode: function(mode) {
        var T = this;
        T.mode = mode;
        T.active = T.settings.modes[mode];
        _.each(T.active, css);     
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
    format: function(setting) {
        var set = setting,
            states = set.states,
            map = {
                "font": "fontFamily",
                "size": "fontSize",
                "bg": "backgroundColor",
                "fg": "color",
                "pad": "padding", 
                "margin": "margin",
                "as": "display", 
                "box": "border",
                "border.color": "borderColor",
                "border.width": "borderWidth",
                "border.radius": "borderRadius",
                "border.style": "borderStyle",
            };

        set = u.remap(set, map);

        if(states) {
            var duration = setting.trans ? setting.trans : T.setting.trans,
               transition = [];
            _.each(states[0], function(rules, name) {
               transition.push(name);           
            });
            set.transition = transition.join(duration+",") + duration;
            
            var init = setting.start;
            if(init) {
                _.extend(set, setting.states[init]);
            }
        }

        _.each(setting.bi, function(letter) {
            switch(letter) {
                case 'b': opts.fontWeight = "bold"; break;
                case 'i': opts.textDecoration = "italic"; break;
            }
        });
    
        var text = "{";
        _.each(set, function(rule, name) {
            text + = 
        });
        return text + "}";
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
