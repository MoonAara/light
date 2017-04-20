var _ = require("underscore"),
    Context = require("./context"),
    Class = require("../../common/class"),
    List = require("../../common/list"),
    El = require("../core/el");

Page = module.exports = Class(function(title) {
    var T = this;
    
    T.el = new El("div");
    T.context = new Context(T);     
    T.title = { 
        text: title,
        el: new El("div", {
            into: T.el,
            addClass: "her-title",
            html: title,
            attr: {
                "data-placeholder": "Title",
                contenteditable: "true",
            }
        }),
    };
    T.lines = new List(El);

},{
    newline: function(before) {
        // TODO header logic
        var T = this,
            line = T.lines.add(["div", {
            addClass: "her-line",
            editable: true,
            style: {
                opacity: 1,
            }
        }], before);

        T.el.insert(line, before);

        T.keys(line);

        return line;
    },
    move: function(line, up) {
        var T = this;
        T.lines.swap(line, up, function(first, second) {
            first.fade(200, function() {
                T.el.insert(second, first);
                first.show(200);
                if(up) T.activate(line);
            });
            second.fade(300, function() {
                second.show(200);
            });
        });  
    },
    remove: function(line) {
        line.fade(200, function() {
            var next = line.Lnext;
            T.lines.each(function(following) {
                following.fade(100);
            }, line);
            setTimeout(function() {
                T.el.remove(line);
            }, 100);
            T.lines.each(function(following) {
                following.show(100);
            }, line);

            T.lines.destroy(line);
        });
    },
    activate: function(line) {
        var T = this;
        line.focus();  
        T.active = line;
    },
    keys: function(line) {
        var T = this;
        line.on({
            '↩': function(e) {
                console.log("pressed enter");
                var next = T.newline(line.Lnext);
                T.activate(next);
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
                if(T.active.Lprev) {
                    T.move(T.active, true);
                }
                return false;
            },
            'shift+↓': function(e) {
                if(T.active.Lnext) {
                    T.move(T.active);
                }
                return false;
            },
            'backspace': function() {
                var T = this;
                if(T.active.text().length === 0) {
                    // remove line and focus on previous
                }
            },
        });
    },
});
