var _ = require("underscore"),
    u = require("../../common/utils"),
    config = require("./config"),
    Context = require("./context"),
    Class = require("../../common/class"),
    List = require("../../common/list"),
    El = require("../core/el");

Page = module.exports = Class(function(title, mode) {
    var T = this;

    T.el = new El("div");
    T.context = new Context(T);     
    T.title = { 
        text: title,
        el: new El("div", {
            into: T.el,
            addClass: "her-title",
            html: title,
            editable: true,
            attr: {
                "data-placeholder": "Title",
            },
        }),
    };

    T.lines = new List(El);
    T.title.el.on({
        'enter': function(e) {
            T.lines.first.focus();
            return false;
        },
    });

    T.style = new Style(config.style);
    T.styling(mode);

},{
    newline: function(before) {
        // TODO header logic
        if(before) console.log("adding before "+before.text());
        var T = this,
            line = T.lines.add(["div", {
            addClass: "her-line",
            editable: true,
            style: {
                opacity: 1,
            },
        }], before);

        line.headerlevel = -1;

        T.el.insert(line, before);

        T.listen(line);
        T.style.the(line, "line");

        return line;
    },
    move: function(line, up) {
        var T = this;
        T.lines.swap(line, up, function(first, second) {
            first.fade(200, function() {
                T.el.insert(second, first);
                first.show(200);
                second.show(200);
                if(up) second.focus();
            });
            second.fade(200);
        });  
    },
    remove: function(line) {
        var T = this,
            prev = line.Lprev,
            next = line.Lnext;
        if(!prev && !next) return;
        line.el.blur();
        
        line.fade(100, function() {
            T.lines.each(function(following) {
                following.fade(100);
            }, line);
            setTimeout(function() {
                T.el.remove(line);

                T.lines.each(function(following) {
                    following.show(200);
                }, line);
                
                T.lines.destroy(line);
                
                if(prev) T.activate(prev);
                else T.activate(next);

                T.lines.each(function(l) {
                    console.log(l.text());
                });
            }, 100);
        });

    },
    activate: function(line) {
        var T = this;
        line.focus();  
        if(T.active && (T.active.id !== line.id)) T.style.trans(T.active, "passive");
        T.active = line;
        T.style.trans(line, "active");
    },
    updateheader: function(line, lowerlevel) {
        var T = this,
            change = false;
        if(lowerlevel) { 
            if(line.headerlevel < T.maxheader) {
                ++line.headerlevel;
                change = true;
            }
        } else {
            if(T.headerlevel >= -1) { 
                --line.headerlevel;
                change = true;
            }
        }
        console.log(line.headerlevel, change, T.maxheader);
        if(change) {
            if(T.headerlevel == -1) {
                line.placeholder('');
                T.style.the(T.active, "line");       
            } else {
                var header = "header";
                if(T.headerlevel > 0) {
                    header += " "+T.headerlevel;
                }
                line.placeholder(header);
                T.style.the(T.active, header);       
            }
        }
        return T.headerlevel;
    },
    listen: function(line) {
        var T = this;
        line.on({
            'mouseup': function(e) {
                T.activate(line);
                //T.style.selection();
            },
            // keystrokes
            '↩': function(e) {
                if(T.active.text().length === 0) {
                    T.updateheader(line, true);
                } else {
                    var next = T.newline(line.Lnext);
                    T.activate(next);
                }
                return false; // prevents default event
            },
            'shift+↩': function(e) {
                var prev = T.newline(line);
                T.activate(prev);
                return false;
            },
            '↑': function(e) {
                if(T.active.Lprev) { T.activate(T.active.Lprev); }
                return false;
            },
            '↓': function(e) {
                if(T.active.Lnext) { T.activate(T.active.Lnext); }
                return false;
            },
            'shift+↑': function(e) {
                if(line.Lprev) {
                    T.move(line, true);
                }
                return false;
            },
            'shift+↓': function(e) {
                if(line.Lnext) {
                    T.move(line);
                }
                return false;
            },
            'backspace': function() {
                if(line.text().length === 0) { 
                    if(line.headerlevel === -1) {
                        T.remove(line);
                    } else {
                        T.updateheader(line);
                    }
                } 
            },
            'keyup': function(e) {
                if(line.text().length > 0) {
                    T.blanks = 0;
                }
            },
        });
    },
    styling: function(mode) {
        var T = this;
        
        if(mode) T.style.mode(mode);

        T.style.the(T.el, "page");
        T.style.the(T.title.el, "title");

        T.style.css("::selection", "color:white;background-color:#000;opacity:1;");

        var subheaders = T.style.active.subheaders;
        T.maxheader = Array.isArray(subheaders) ? subheaders.length : 0;
    },
});
