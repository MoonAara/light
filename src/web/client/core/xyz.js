var _ = require("underscore"),
    Class = require("../../common/class");

//------------------------------------------    
//
// 3D point, can be initialized with either:
//
//   new XYZ({ x: 25, y: 1, z: 2})
//      
//      -or-
//
//   new XY(25, 1, 2) 
//
// both would have the same result  
//
// any undefined values will be set to zero
//
//------------------------------------------    
var XYZ = module.exports = Class(function(x, y, z /*,.. callback functions */) {
    var T = this,
        cbs = Array.prototype.slice.apply(arguments, [3]);
    
    if(x && typeof x === "object") {
        T.x = x.x;
        T.y = x.y;
        T.z = x.z;
    } else {
        T.x = x;
        T.y = y;
        T.z = z;
    }
    T.x = T.x ? T.x : 0;
    T.y = T.y ? T.y : 0;
    T.z = T.z ? T.z : 0;

    T.bindings = [];

    T.callbacks = _.filter(cbs, function(cb) {
        return typeof cb === "function";
    });
},{
    // add a callback whenever point is changed 
    callback: function(f) {
        this.callbacks.push(f);
    },

    // ------------------------------------------
    // 
    // the following functions all change this XY
    // and consequently
    // will affect any others bound to this one
    //
    // ------------------------------------------
    add: function(xy) {
        var T = this;
        T.x += xy.x;
        T.y += xy.y;
        T.z += xz.z;
        return T.update();
    },
    sub: function(xy) {
        var T = this;
        T.x -= xy.x;
        T.y -= xy.y;
        T.z -= xz.z;
        return T.update();
    },
    scale: function(by) {
        var T = this;
        T.x *= by;
        T.y *= by;
        T.z *= bz;
        return T.update();
    },
    resize: function(length) {
        var T = this,
            d = T.length(),
            l = length ? length : 1,
            s = l/d;
        return T.scale(s);
    },
    set: function(x, y) {
        var T = this;
        T.x = x;
        T.y = y;
        T.z = z;
        return T.update();
    },
    become: function(another) {
        var T = this;
        T.x = another.x;
        T.y = another.y;
        T.z = another.z;
        return T.update();
    },
    // shift this XY towards another given
    // a certain amount of change allowed
    //
    // same logic works for vectors & points
    towards: function(another, amount) {
        var T = this,
            diff = T.diff(another),
            len = diff.length();
        if(amount >= len) { 
            T.become(another); 
        } else {
            T.add(diff.scale(amount/len));
        }
        return T.update();
    },
    // not sure if this is ever useful..
    change: function(f) {
        var T = this;
        return T.set(f(T));
    },

    // ----------------------------------------------
    // 
    // the following are utility functions that won't 
    // change this XY
    // or any others bound to it
    //
    // ----------------------------------------------
    equal: function(another, e) {
        var err = e ? e : 0.0001;
        return (Math.abs(another.x - this.x) < err) && 
               (Math.abs(another.y - this.y) < err) && 
               (Math.abs(another.z - this.z) < err);
    },
    diff: function(another) {
        var T = this;
        return new XY(another.x - T.x, another.y - T.y, another.z - T.z);
    },
    sum: function(another) {
        var T = this;
        return new XY(another.x + T.x, another.y + T.y, another.z + T.z);
    },
    length: function() {
        var T = this;
        return Math.pow(T.x * T.x + T.y * T.y + T.z * T.z, 1/3);
    },
    // returns a new vector that has 'length'
    // 1 if not specified 
    normal: function(length) {
        var T = this,
            d = T.length(),
            l = length ? length : 1,
            s = l/d;
        return new XYZ(s*T.x, s*T.y, s*T.z);
    },
    replica: function() {
        return new XY(this.x, this.y, this.z);
    },
    // treats these as vectors around common origin,
    // determines if their normals are aligned 
    // within distance e
    aligned: function(another, e) {
        var T = this,
            normal = T.normal(),
            diff = normal.diff(another.normal());
        return (diff.length() <= e);
    },

    // -------------------------------------------------
    //
    // private functions below, no need to call manually
    //
    // -------------------------------------------------
    update: function() {
        var T = this;

        _.each(T.bindings, function(binding) {
            _.each(binding.def.split(','), function(part) {
                var coord = part[0],
                    offset = (part.length > 2) ? 
                        Number.parseFloat(part.slice(1)) :
                        0 ;

                binding.bound[coord] = T[coord] + offset;
            });
        });

        _.each(T.callbacks, function(cb) {
            cb(T);
        });

        return T;
    },
});
 
