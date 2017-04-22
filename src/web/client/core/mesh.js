var _ = require("underscore"),
    Class = require("../../common/class"),
    XYZ = require("./xyz");

//-------------------------------------------
//
// mesh 
//
// an animation library
// built on the concept of independent actors
// that seek goals
// and align themselves to other actors
//
// it's like a little community
// where you're the goddess
//
// the basic actor is the seeker--
// a point that maintains its own
// goals, velocity, and restrictions
//
// blocks, circles, and other shapes 
// will automatically adjust
// as the seekers they are defined by
// move according to their directions
//
//-------------------------------------------
var Mesh = module.exports = Class(function(html, opts) {
    var T = this;

    opts = opts ? opts : {};
    _.defaults(opts, {
        speed: 50, // maximum speed/t
        agility: 0.1, // maximum acceleration/t
    });
    
    T.shapes = {};
    T.moving = {};
    T.redraw = {};
    T.pins = {};
    T.movingpins = {};
   
    // default values governing movement
    T.speed = opts.speed; 
    T.agility = opts.agility; 

    T.html = new El(html, {
        style: {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
        }
    });

    T.time = performance.now();

    T.init();

},{
    //---------------------------------------------
    //
    // Essentials
    //
    //---------------------------------------------

    line: function(from, to, length, bits) {
        var T = this,
            parts = new List(Space),
            connection = T.diff(from, to), 
            size = space ? Math.sqrt(space) : 1,
            apart = T.length(connection) / length;
        for(var i = 0; i < length; i+=apart) {
            var place = T.sum(from, T.normal(connection, i)),
                dot = T.circle(_.extend(line, {
                    r: size,
                }));
                parts.add([space]);
        }
        return parts;
    },

    //---------------------------------------------
    //
    // Seekers
    //
    // are points that can be directed in 3 ways
    //
    // direct(seeker, x, y, z) or
    // direct(seeker, XYZ): 
    //  give the seeker a goal,
    //  and it will move there 
    //  according to its constraints
    //
    // shove(seeker, x, y, z): push the seeker 
    //  in the direction of vector (x, y, z); 
    //  if it has a goal, it will try 
    //  to correct itself 
    //  and if it doesn't,
    //  it will try to stop itself;
    //
    //---------------------------------------------
    seeker: function(x, y, z, opts) {
        var T = this,
            seeker = new XYZ(x, y, z, function(s) {
                T.update(s, true);    
            });
            if(typeof x === "object") opts = y;
            _.extend(seeker, {
                id: 's'+T.sIds++,
                goal: null,
                vel: new XY(), // current motion vector
                defines: [],
            }, _.defaults(opts ? opts : {}, {
                agility: T.agility,
                speed: T.speed,    
                whimsy: false,
                timed: 0,
            }));
        return seeker;
    },
    // direct
    // a seeker to a goal
    // defined by (x,y,z)
    // 
    // in the case that y is 'null',
    // the 'x' parameter is
    // an object with (x,y,z) defined 
    direct: function(seeker, x, y, z) {
        var T = this,
            old_goal = seeker.goal;
        if(!y) {
            seeker.goal = x;
        } else {
            seeker.goal = new XYZ(x,y,z);
        }
        T.moving[seeker.id] = seeker;

        return old_goal;
    },
    // shove a seeker
    // in the direction of vector 
    // defined by (x,y,z)
    // 
    // alternatively,
    // the 'by_x' parameter is 
    // a single XYZ vector
    shove: function(seeker, by_x, by_y, by_z) {
        seeker.vel.add(new XY(by_x, by_y));
        T.moving[point.id] = point;
    },
    tangent: function(seeker) {
        return new XY(-vel.y, vel.x);    
    },

    //-------------------------------
    //
    // Pins
    // 
    //-------------------------------

    pin: function(shape, pin, vel) {
        var T = this,
            d = pin.diff(shape),
            perpin = {},
            pershape = {
                shape: shape,
                a: Math.atan2(d.y, d.x),
                d: d.length(),       
                holds: shape,
                v: vel,
            };
        if(!pin.data.id) perpin.id = T.pIds++;

        T.pins[perpin.id] = pin;

        pin.store(perpin);
        pin.enqueue(pershape);
        
        if(vel) {
            T.movingpins[perpin.id] = pin;
        }

        pin.callback(function(p, old) {
            T.redraw[perpin.id] = true;
        });
        return pin;
    },
    attach: function(pin, shape) {
        
    },
    drawpin: function(pin) {
        var T = this;
        _.each(pin.queue, function(data) {
            //T.rotate(data, data.v);
            var shape = data.holds; 
            shape.x = pin.x + data.d * Math.cos(data.a);
            shape.y = pin.y + data.d * Math.sin(data.a);
        });
    },
    orbit: function(pin, speed) {
        var T = this;
        if(speed === 0) {
            delete T.movingpins[pin.id];
        } else {
            pin.v = speed;
            T.movingpins[pin.id] = pin;
        }
    },
    radial: function(compass) {
        return new XY(
            compass.x + compass.d * Math.cos(compass.a),
            compass.y + compass.d * Math.sin(compass.a)
        );
    },
    compass: function(base, angle, distance) {
        var T = this,
            pin = T.seeker(base);
        _.extend(pin, {
            a: angle,
            d: distance,
        });
        var end = T.radial(pin);
        T.pin(end, pin); 
        pin.end = end;
        return pin;
    },
    rotate: function(compass, by) {
        var T = this;
        compass.a += by/(2*Math.PI);
        if(compass.a > 2*Math.PI) compass.a -= 2*Math.PI;
        //compass.end = T.radial(compass);
    },
    extend: function(compass, by) {
        compass.d += by;
        compass.end = T.radial(compass);
    },

    //-------------------------------
    // 
    // Circles
    //
    // are defined by a single seeker
    // and a radius
    //
    // direct/shove them like
    // other seekers;
    // main difference is that
    // you can actually see them
    // which is a benefit
    // when stealth is silly;
    // i love being stealthy
    // but sometimes
    // you know
    // you just gotta put yourself out there
    //
    // use 'el' to manipulate
    // its representation, e.g.
    //
    //  circle.el.style({
    //      borderRadius: none,
    //  });
    //
    // to turn it into a square
    // but why would you do that
    // i love circles
    //
    //------------------------------- 
    circle: function(rxy, opts) {
        var T = this,
            diameter = 2*rxy.r,
            circle = T.seeker(rxy, opts);

        opts = _.defaults(opts ? opts : {}, {
            square: false,
        });
        _.extend(circle, {
            id: 'c'+T.cIds++,
            r: rxy.r,
            el: new El("div", {
                style: {
                    width: diameter,
                    height: diameter,
                    borderRadius: opts.square ? 0 : rxy.r +"px",
                },
                is: "her-class her-circle",
                into: T.html,
            }),
        }); 
        T.define(circle, circle); // trust me it makes sense
        T.drawcircle(circle);
        T.shapes[circle.id] = circle;
        return circle;
    },

    //--------------------------------------------
    //
    // Blocks
    //
    // are rectangles defined by two seekers:
    // tl, which means top left and
    // br, which means bottom something
    //  
    // so like, you move those
    // like normal seekers
    // and the block will resize itself
    // accordingly and automatically,
    // don't worry about it;
    // the only thing that can go wrong
    // is you worry too much
    // and i know it's difficult sometimes
    // given the stress
    //
    // initialize with a position that's either:
    //
    // an array of two seekers: [seekera, seekerb]
    // 
    //      -or-
    //
    // an object with {
    //  top: y,
    //  left: x,
    //  width: w,
    //  height: h,
    // }
    //
    //-------------------------------------------- 
    block: function(position, options) {
        var T = this,
            opts = _.defaults(options ? options : {}, {
                is: '',
                editable: true,    
            }), 
            topleft, bottomright;
        
        if(Array.isArray(position)) {
            topleft = position[0];
            bottomright = position[1];
        } else {
            var l = position.left,
                t = position.top,
                r = position.right ? position.right : l + position.width,
                b = position.bottom ? position.bottom : t + position.height;

            topleft = T.seeker(l, t);
            bottomright = T.seeker(r, b);
        }
        
        var id = 'b'+T.bIds++,
            block = {
                id: id,
                tl: topleft,
                br: bottomright,
                el: new El("div", {
                    id: id,    
                    is: "her-class her-block "+opts.addClass,
                    into: T.html,
                    editable: opts.editable,
                }),
            };
        T.define(block, topleft, bottomright);
        T.shapes[id] = block;
        T.drawblock(block);
        return block;
    },
    grid: function(width, height, opts) { 
        var T = this,
            grid = [],
            grid_id = T.gIds++,
            into = opts.into ? opts.into : T.html;
        var block_size = opts.block_size;
        if(block_size) {
            block_size = Math.min(Math.floor(width/block_size), Math.floor(height/block_size));
        } else { 
            block_size = width/16;
        }

        for(var r = 0; r < height; r++) {
            var row = [];
            for(var c = 0; c < width; c++) {
                var block = T.block({
                    x: c,
                    y: r,
                    width: block_size,
                    height: block_size,
                },{
                    id: [grid_id,c,r].join("-"),
                    is: "her-class her-grid-block",   
                    into: into,
                });
                row.push(block);
            }
        
            if(grid.length > 0) {
                var prev_row = grid[h-1];
                _.each(row, function(column, c) {
                    var same_position = prev_row[c+1],
                        block = row[c];
                    T.pin(block.br, same_position.tl); 
                }); 
            }
        }
        return grid;
    },

    width: function(block) {
        return block.br.x - block.tl.x;
    },
    height: function(block) {
        return block.br.y - block.tl.y;
    },
    center: function(block) {},
    // moves the block so that its 
    // upper left corner is at xy
    // and its size doesn't change
    // it just stays how it is
    moveblock: function(block, xy) {
        var diff = block.tl.diff(new XY(xy));
        T.direct(block.tl, xy);
        T.direct(block.br, block.br.sum(diff));
    },

    //---------------------------------------------
    // 
    // text/styling
    //
    //---------------------------------------------
    style: function(element, styles) {
        element.el.style(styles);
    },
    write: function(element, text, style) {
        var T = this, opts = {};
        if(style) {
            opts.fontSize = style.size;
            opts.fontFamily = style.font+"px";
            if(_.contains(style.style, "b")) {
                opts.fontWeight = "bold";
            }
            if(_.contains(style.style, "i")) {
                opts.fontStyle = "italic";
            }
            T.style(element, opts);
        }

        element.html(text);
        return element;
    },

    //---------------------------------------------
    //
    // private functions, no need to call yourself
    //
    // just go away
    // unless you're..
    // changing the core functionality..
    // in which case
    // thank you,
    // godspeed
    //
    //---------------------------------------------
    animate: function(time) {
        var T = this;

        T.t = time - T.time;
        T.time = time;

        _.each(T.moving, function(seeker) {
            T.update(seeker);
        });
        _.each(T.ocean, function(ocean) {
            T.flow(ocean);
        });
        _.each(T.movingpins, function(pin) {
            T.drawpin(pin);
        });

        _.each(T.redraw, function(flag, id) {
            console.log(id);
            var shape = T.shapes[id];
            switch(id[0]) {
                case 'b': T.drawblock(shape); break;
                case 'c': T.drawcircle(shape); break;
            }
            delete T.redraw[id];
        });

        window.requestAnimationFrame(T.animate.bind(T));
    },
    // moves a point towards its goal,
    // returns true if point was moved
    move: function(seeker) {
        var T = this,
            time = T.t,
            stillness = new XYZ(),
            moved = false;
        if(seeker.goal) {
            var ideal = seeker.diff(seeker.goal),
                change = seeker.agility * time,
                limit = seeker.speed * time,
                dist = ideal.length();

            if(!seeker.whimsy) {
                var stoppable = Math.sqrt(2*dist*seeker.agility),
                    max_vel = Math.min(limit, stoppable);

                if(max_vel < dist) ideal.resize(max_vel);
            }

            seeker.vel.towards(ideal, change);
            seeker.add(seeker.vel);

            if(seeker.equal(seeker.goal)) {
                seeker.goal = null;
                seeker.vel = stillness;
                delete T.moving[seeker.id];
            }            
            moved = true;
        } 
        else if(!seeker.vel.equals(stillness)) {
            // when there's no goal, the seeker will try 
            // to come to a rest
            seeker.vel.towards(stillness, seeker.agility * time);
            seeker.add(seeker.vel);            
        } 
    },
    update: function(seeker, manual) {
        var T = this,
            moved = manual ? true : T.move(seeker);

        if(moved) {
            _.each(seeker.followers, function(follower) {
                if(!follower.goal) {
                    T.direct(follower, seeker);
                }
            });
            _.each(seeker.defines, function(id) {
                T.redraw[id] = true;
            });
        }
    },
    init: function() {
        var T = this, 
            vendors = ['webkit', 'moz', 'o'];

        _.each("s,b,c,p,g".split(','), function(idprefix) {
            T[idprefix+"Ids"] = 0;     
        });

        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        window.requestAnimationFrame(T.animate.bind(T));
    },
    drawcircle: function(circle) {
        circle.el.style({
            left: circle.x - circle.r,
            top: circle.y - circle.r,
            width: d,
            height: d,
        });
    },
    drawblock: function(block) {
        var T = this;

        block.el.style({
            top: block.tl.y,
            left: block.tl.x,
            width: T.width(block),
            height: T.height(block),
        });
    },
    // you can pass one or more seekers
    define: function(shape/*, seekers,.. */) {
        var seekers = Array.prototype.slice.call(arguments, 1);
        _.each(seekers, function(seeker) {
            seeker.defines.push(shape.id);
        });
    },
});
