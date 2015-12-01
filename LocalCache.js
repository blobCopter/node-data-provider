var BaseCache = require('./BaseCache');
var Utils = require('./utils');
var LocalStorage = require('./LocalStorage');

var LocalCache = function(filename, opts) {
    var storage = new LocalStorage(filename);
    BaseCache.call(this, storage, opts);
};

Utils.Klass.extend(LocalCache, BaseCache);

module.exports = LocalCache;