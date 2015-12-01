var BaseCache = require('./BaseCache');
var Utils = require('./utils');
var MemoryStorage = require('./MemoryStorage');

var MemoryCache = function(opts) {
    var storage = new MemoryStorage();
    BaseCache.call(this, storage, opts);
};

Utils.Klass.extend(MemoryCache, BaseCache);

module.exports = MemoryCache;