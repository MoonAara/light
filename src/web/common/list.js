var _ = require("underscore"),
    Class = require("./class");

// Linked List
var List = module.exports = Class(function(Item, opts) {
    var T = this;
    T.start = null;
    T.end = null;
    T.Item = Item;
    T.opts = opts = opts ? opts : {};
    T.index = {};
    T.count = {};
    T.ids = 0;

    _.each(opts.index, function(property) {
        T.index[property] = {};
    });

    _.each(opts.count, function(property) {
        T.count[property] = {};
    });

    T.validate();
},
{
    validate: function(opts) {
        if(typeof this.Item !== "function") throw "expecting item constructor";
        _.each(this.opts, function(val, name) {
            switch(name) {
                case "init":
                    if(typeof val !== "function") throw "init option expects function";
                    break;
                case "index":
                    if(!Array.isArray(val)) throw "index option expects list of strings";
                    break;
            }
        });
    },
    make: function(args) {
        // makes a new node with class Item
        return new (Function.prototype.bind.apply(this.Item, args ? [null].concat(args) : []));
    },
    init: function(item) {
        var T = this;
        if(T.opts.init) T.opts.init(item);
        if(T.opts.index) {
            _.each(T.opts.index, function(property) {
                var slot = T.index[property][item[property]];
                if(Array.isArray(slot)) {
                    slot.push(item);
                } else {
                    T.index[property][item[property]] = [item];
                }

            });
        }
        if(T.opts.count) {
            _.each(T.opts.count, function(property) {
                var slot = T.count[property][item[property]];
                if(typeof slot === "number") {
                    slot++;    
                } else {
                    T.count[property][item[property]] = 1;
                }
            });
        }
        return item;
    },
    destroy: function(item) {
        var T = this,
            Lprev = item.Lprev,
            Lnext = item.Lnext;
        if(Lnext && Lprev) {
            T.link(Lprev, Lnext);    
        } else {
            if(!Lprev) { 
                T.start = Lnext;
                if(Lnext) Lnext.Lprev = null; 
            } else { // (!Lnext)
                T.end = Lprev;
                if(Lprev) Lprev.Lnext = null; 
            }  
        }
        if(T.opts.index) {
            _.each(T.opts.index, function(property) {
                var slot = T.index[property][item[property]];
                slot = _.filter(slot, function(i) {
                    return i !== item;
                });
            });
        }
    },
    find: function(property, value) {
        return T.index[property][value];     
    },
    link: function(first, second) {
        if(first && second) {
            first.Lnext = second;
            second.Lprev = first;
        }
    },
    swap: function(node, up, cb) {
        var T = this,
            first = up ? node.Lprev : node,
            second = up ? node : node.Lnext;

        if(first.Lprev) {
            T.link(first.Lprev, second);         
        } else {
            second.Lprev = null; // prevent cycles
        }
        if(second.Lnext) {
            T.link(first, second.Lnext);
        } else {
            first.Lnext = null;
        }
        this.link(second, first);
        //    second.Lnext = first;
        //    first.Lprev = second;
        if(typeof cb === "function") cb(first, second);
    },
    add: function(args, before) {
        var T = this,
            item = T.make(args);
        if(before) {
            if(T.start === before) {
                T.start = item;
            } else {
                T.link(before.Lprev, item);
            }
            T.link(item, before);
        } else {
            var last = T.end;
            T.end = item;
            T.link(last, item);
        }
        if(!T.start) T.start = item;
        if(!T.end) T.end = item;

        item.id = T.ids++;
        T.init(item, before);
        return item;
    },
    // creates a sub-list beneath the 'after' node
    // in this way, the list supports hierarchy
    embed: function(opts, after) {
        after.beneath = new List(T.Item, {
            index: opts.index ? T.index.concat(opts.index) : T.index,
            init: function(item) {
                T.init(item);
                if(opts.init) opts.init(item);
            }
        });
        return after.beneath;
    },
    remove: function(item) {
        this.destroy(item);
    },
    from: function(array) {
        var T = this;
        _.each(array, function(item) {
            T.add(item);
        });
    },
    each: function(f, start) {
        var n = start ? start : this.start,
            i = 0;
        while(n) {
            f(n, i++);
            n = n.Lnext;
        }
    },
    // spread
    //
    // like each, but 'spreads' from origin node
    //
    // i passed to function will be distance from this
    // original node, negative means earlier in list
    //
    // terminates at cutoff distance from origin node
    //
    // an independent 'cache' is maintained in either direction
    // that can be used for things like dynamic programming,
    // initialized with the values provided in cache
    spread: function(origin, f, cutoff, cache) {
        var before = origin.Lprev,
            before_cache = _.clone(cache),
            after = origin.Lnext,
            after_cache = _.clone(cache);
            i = 0;
            cutoff = cutoff ? cutoff : Infinity;
        f(origin, i++);
        while(i < cutoff && (before || after)) {
            if(before) { 
                f(before, -i, before_cache);
                before = before.Lprev;
            }
            if(after) { 
                f(after, i, after_cache);
                after = after.Lnext;
            }
            ++i;
        }
        return {
            before: before_cache,
            after: after_cache,
        };
    }
});
