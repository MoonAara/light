var _ = require("underscore"),
    Class = require("./class");

// Linked List
var Links = module.exports = Class(function(content) {
    var T = this;
    T.start = null;
    T.end = null;
    T.ids = opts.lastid ? opts.lastid : 0; 
    T.map = {};

    T.load(content);
},
{
    load: function(nodelist) {
        var T = this;
        _.each(nodelist, function(node) {
            if(node.id) {
                T.map[id] = node;
                T.ids = Math.max(id, T.ids); 
            } else throw "trying to link content without id";        
        });
    },
    destroy: function(node) {
        var T = this,
            prev = node.prev,
            next = node.next;
        if(next && prev) {
            T.link(prev, next);    
        } else {
            if(!prev) { 
                T.start = next;
                if(next) next.prev = null; 
            } else { // (!Lnext)
                T.end = prev;
                if(prev) prev.next = null; 
            }  
        }
        delete T.map[node.id];
    },
    link: function(first, second) {
        first.next = second;
        second.prev = first;
    },
    swap: function(node, up, cb) {
        var T = this,
            first = up ? node.prev : node,
            second = up ? node : node.next;

        if(first.Lprev) {
            T.link(first.prev, second);         
        } else {
            second.prev = null; // prevent cycles
        }
        if(second.next) {
            T.link(first, second.Lnext);
        } else {
            first.next = null;
        }
        this.link(second, first);
        if(typeof cb === "function") cb(first, second);
    },

    add: function(item, before) {
        var T = this,
            node = {
                id: T.ids++,
                m: item,
            };
        if(before) {
            if(T.start === before) {
                T.start = item;
            } else {
                T.link(node.prev, node);
            }
            T.link(item, before);
        } else {
            var last = T.end;
            T.end = item;
            T.link(last, item);
        }
        if(!T.start) T.start = item;
        if(!T.end) T.end = item;

        return item;
    },
    remove: function(item) {
        this.destroy(item);
    },
    addlist: function(array) {
        var T = this;
        _.each(array, function(item) {
            T.add(item);
        });
    },
    each: function(f) {
        var n = this.start,
            i = 0;
        while(n) {
            f(n, i++);
            n = n.next;
        }
    },
    // spread
    //
    // like each, but 'spreads' from origin node
    //
    // can be passed 'aggregatition' function for
    // dynamic programming
    spread: function(origin, f, until_false, aggregation) {
        var results = new Links(),
            agg = {};
            cutoff = (typeof until_false === "function") ? until_false :
                function(node) {return true;};
        if(cutoff(origin)) {
            results.add(f(origin));
            _.extend(agg, aggregation(origin, agg, 0));
        }
        var before = origin.prev,
            before_i = -1,
            after_i = 1,
            after = origin.next;
        while(cutoff(before)) {
            results.add(f(before, before_i));   
            _.extend(agg, aggregation(origin, agg, before_i));
            --before_i;
            before = before.prev;
        }
        while(cutoff(after)) {
            results.add(f(after, after_i));   
            _.extend(agg, aggregation(origin, agg, after_i));
            ++after_i;
            after = after.next;
        }

        return {
            aggregation: agg,
            results: results,
        };
    }
});
