var _ = require("underscore");

module.exports = function(init, methods) {
    var Class = function() {
        var T = this;
        init.apply(T, arguments);
    };
    _.each(methods, function(method, name) {
        Class.prototype[name] = method;
    });
    return Class;
};

