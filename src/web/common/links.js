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
        T.link(prev, next);    
        if(!prev) T.start = next;
        if(!next) T.end = prev;
        delete T.map[node.id];
    },
    link: function(first, second) {
        first.next = second;
        second.prev = first;
    },
    swap: function(first, second) {
        if(first.Lprev) {
            first.prev.next = second;
            second.prev = first.prev;
        } else {
            second.prev = null; // prevent cycles
        }
        if(second.next) {
            second.next.prev = first;   
            first.next = second.next;
        } else {
            first.next = null;
        }
        this.link(second, first);
    },
    add: function(item, before) {
        var T = this,
            node = {
                id: T.ids++,
                content: item,
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
                function(node) {return true};
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
