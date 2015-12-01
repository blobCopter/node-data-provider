/**
 * Basis memory storage. Nothing to see here.
 *
 */
var MemoryStorage = function() {
    this._data = {};
};

MemoryStorage.prototype = {

    _data: null,

    set: function(key, value) {
        this._data[key] = value;
    },

    unset: function(key) {
        this._data[key] = null;
    },

    get: function(key) {
        return this._data[key];
    },

    clear: function() {
        this._data = {};
    }

};

module.exports = MemoryStorage;