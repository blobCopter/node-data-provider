module.exports = {

    Klass: {
        extend: function(subClass, superClass) {
            var F = function() {};
            F.prototype = superClass.prototype;
            subClass.prototype = new F();
            subClass.prototype.constructor = subClass;
        }
    },

    extend: function(dest, src, deep) {
        if (!dest || !src) {
            return dest;
        }
        for (var prop in src) {
            switch (typeof src[prop]) {
                case "object":
                    var isArray = Array.isArray(src[prop]);
                    if (deep) {
                        var tmp = dest[prop] || (isArray ? [] : {});
                        dest[prop] = this.extend(tmp, src[prop], deep);
                        break;
                    }
                default:
                    dest[prop] = src[prop];
            }
        }
        return dest;
    }

};