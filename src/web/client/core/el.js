var _ = require("underscore"),
    Class = require("../../common/class"),
    events = require("./events"),
    morph = require("../ext/morpheus");

var El = module.exports = Class(function(html, opts) {
    var T = this;
    T.el = (typeof html === "string" || !html) ? 
            (html && html[0] === '#') ? 
                document.getElementById(html.substring(1)) :
                document.createElement(html ? html : "div")
            : (html instanceof El) ? html.el : html;

    _.each(opts, function(val, opt) {
        if(typeof T[opt] === "function") T[opt](val);
    });
},{
    attr: function(attrs) {
        var T = this;
        _.each(attrs, function(a, name) {
            T.el.setAttribute(name, a);
        });
    },
    id: function(id) {
        this.attr({id:id});
    },
    into: function(el, before) {
        var tel = new El(el);
        tel.insert(this.el, before);
        return tel;
    },
    insert: function(other, before) {
        var T = this,
            other_el = new El(other);
        if(before) {
            var bel = new El(before);
            T.el.insertBefore(other_el.el, bel.el);
        } else {
            T.el.appendChild(other_el.el);
        }
        other_el.up = T;
        return other_el;
    },
    remove: function(child) {
        this.el.removeChild(child.el);
    },
    is: function(type) {
        var T = this,
            current = T.el.className;
        if(!_.contains(type.split(' '), current) {
            this.el.className += ' '+cl;
        }
    },
    isnt: function(type) {
        var T = this,
            classes = _.filter(T.el.className.split(' '), function(name) {
                return name !== cl;  
            });
        T.el.className = classes.join(' ');
    },
    toggle: function(type) {
        var T = this,
            classes = T.el.className.split(' ');
        if(_.contains(classes, cl)) {
            T.removeClass(cl);
        } else {
            T.addClass(cl);
        }
    },
    placeholder: function(text) {
        this.attr({"data-placeholder": text});
    },
    editable: function(is) {
        if(is) this.attr({contenteditable:"true"});
    },
    focus: function() {
        this.el.focus();
    },
    html: function(html) {
        this.el.innerHTML = html;
    },
    style: function(styles) {
        _.extend(this.el.style, styles);
    },
    anim: function(styles, cb) { // see Morpheus docs
        var T = this;
        if(typeof cb === "function") { 
            _.extend(styles, {
                complete: cb,   
            });
        }
        return morph(T.el, styles);
    },
    fade: function(milli, cb) {
        this.anim({
            opacity: 0,
            duration: milli,
        }, cb);
    },  
    show: function(milli, cb) {
        this.anim({
            opacity: 1,
            duration: milli,
        }, cb);
    },
    on: function(eventmap) {
        var T = this;
        _.each(eventmap, function(handler, trigger) {
            events(T.el, trigger, handler);     
        }); 
    },
    width: function() { return this.el.offsetWidth; },
    height: function() { return this.el.offsetHeight; },
    rect: function() { return this.el.getBoundingClientRect(); },
    get: function(style) { return this.el.style[style]; },
    text: function() { return this.el.innerHTML; },
});
