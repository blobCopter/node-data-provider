var BaseCache = function(storage, opts) {

    if (!storage) {
        throw "[BaseCache] A storage is required";
    }

    opts = opts || {};
    this._storage = storage;
    this._cacheTimeout = opts.cacheTimeout || -1;
};

BaseCache.prototype = {

    _data: null,

    add: function(key, value, cacheTimeout) {
        // This cache timeout overrides the default one
        cacheTimeout = cacheTimeout || this._cacheTimeout;
        var expiration = cacheTimeout > 0 ? new Date(Date.now() + cacheTimeout) : -1;
        this._storage.set(key, {
            value: value,
            expiration: expiration
        });
    },

    get: function(key) {
        var res = this._storage.get(key);
        if (!res) {
            return null;
        }
        if (res.expiration > 0 && res.expiration < Date.now()) {
            this._storage.unset(key);
            return null;
        }
        return res.value;
    },

    remove: function(key) {
        this._storage.unset(key);
    },

    clear: function() {
        this._storage.clear();
    }
};

module.exports = BaseCache;