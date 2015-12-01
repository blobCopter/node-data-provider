var MemoryCache = require('./MemoryCache');
var Utils = require('./utils');

var BaseProvider = function(opts) {
    opts = opts || {};
    this._cache = opts.cache || new MemoryCache();
    this.CacheTimeout = opts.cacheTimeout || this.CacheTimeout;

    this.__createWrappers(this, Object.getPrototypeOf(this), this.NoCache, this.CacheTimeout, "");
};

// Use the default ES6 promises
// Can be overriden here (e.g BaseProvider.Promise = Q.Promise)
BaseProvider.Promise = Promise;
BaseProvider.generateCacheKey = function(args) {
    return JSON.stringify(args);
};

var reservedTerms = ["constructor", "NoCache", "DataWrapper", "CacheTimeout", "__createWrappers", "__wrapFunction"];

BaseProvider.prototype = {

    __createWrappers: function(instance, proto, noCache, timeout, jsonPath) {
        // Creates the function wrappers
        if (typeof instance.NoCache !== "undefined") {
            noCache = !!instance.NoCache
        }
        var dataWrapper = instance.DataWrapper;
        
        for (var key in proto) {

            if (!proto.hasOwnProperty(key) || reservedTerms.indexOf(key) >= 0) {
                continue;
            }

            switch (typeof proto[key]) {
                case "object":
                    
                    this.__createWrappers(
                        instance[key],
                        proto[key],
                        noCache,
                        proto.CacheTimeout || timeout,
                        jsonPath + "/" + key
                    );
                    break;

                case "function":
                    this.__wrapFunction(instance, proto, key, noCache, dataWrapper, timeout, jsonPath);
                    break;
            }
        }
    },

    __wrapFunction: function(instance, proto, prop, noCache, dataWrapper, timeout, jsonPath) {
        var func = proto[prop];
        var promise = BaseProvider.Promise;
        var cache = this._cache;
        instance[prop] = function() {

            if (noCache) {
                // We should not cache this value
                return promise.resolve(func.apply(this, arguments));
            }

            // We make a copy of the arguments in case the function modifies them
            var args = Utils.extend([], Array.prototype.slice.call(arguments), true);
            var key = jsonPath + "/" + prop + ":" + BaseProvider.generateCacheKey(args);

            var cachedData = cache.get(key);
            if (cachedData) {
                return promise.resolve(cachedData);
            } else {
                // No cached data, we call the original method
                var data = promise.resolve(func.apply(this, arguments))
                    .then(function(res) {
                        return dataWrapper ? dataWrapper(res) : res;
                    });

                cache.add(key, data);
                return data.then(function(res) {
                    cache.add(key, res, timeout); // Store the returned value instead of the promise
                    return res;
                });
            }
        }.bind(this);
    }


};


module.exports = BaseProvider;