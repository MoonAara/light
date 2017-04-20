var Class = require("../../common/class"),
    webfont = require("../ext/webfont");

Web = module.exports = Class(function() {
    var T = this;
    T.fonts = {};    
},{
    loadfont: function(family, provider) {
        var T = this;
        if(T.fonts[family]) return;
        var req = {},
            prov = provider ? provider : "google";
        req[prov] = {
            families: [family],   
        },
        webfont.load(req);
        T.fonts[family] = prov;
    },
});

