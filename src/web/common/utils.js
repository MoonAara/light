var Class = require("./class");

utils = module.exports = (function () { return {
    copy: function(object) {
        var T = this,
            clone = {};

        object.forEach(function(name, value) {
            if(typeof object[name] === "object" && isNotNull(value)) {
                clone[name] = T.copy(value);
            } else {
                clone[name] = value;
            }
        }

        return clone;
    },
})();
