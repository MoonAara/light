var _ = require("underscore"),
    webfont = require("../ext/webfont"),
    Class = require("../../common/class"),
    El = require("../core/el"),
    XY = require("./xy");
    Mesh = require("../core/mesh");

// uses Google Fonts to print letter blocks
Style = module.exports = Class(function(setting) {
    var T = this;

    T.setting = setting;

    T.fonts = {};
    T.fontfamily = T.font(opts.font);

    // load fonts
    _.each([setting, setting.presets], function(set) {
        _.each(set, function(options) {
            T.font(options.font);
        });
    });

    T.el = new El("div", {
        addClass: "her-style",
        style: {
            display: "none",
        }
    });
    
    T.map = {}; // keep track of all styled els
},{
    the: function(el, as) { // something like "bold italic"
        var T = this,
            setting = T.setting[style],
            opts = {
                fontFamily: setting.font,
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

        T.map[as].push(el);
    },
    change: function(style, setting) {
        var T = this;
        _.extend(T.setting[style], setting);
        
        _.each(T.map[style], function(el) {
            T.style(el, style);
        });
    },
    font: function(family, provider) {
        if(!family) return;

        var T = this;

        if(!T.fonts[family]) {
            var fontprovider = provider ? provider : "google";

            var req = {};
            req[provider] = {
                families: [family],
            };
            webfont.load(req);
            T.fonts[family] = provider;
        }
    },
});
