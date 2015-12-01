var BaseProvider = require('../BaseProvider.js');
var Utils = require('../utils');

var MyProvider = function () {
    BaseProvider.apply(this, arguments);
};

Utils.Klass.extend(MyProvider, BaseProvider);

MyProvider.prototype = Utils.extend(MyProvider.prototype, {

    NoCache: false,
	CacheTimeout: 1000,
    getMovies: function () {
        console.log("[getMovies]");
        return ["The avengers", "Star Wars", "Sleepless in seattle"];
    }

});


//////////////// RUN

var provider = new MyProvider();

provider.getMovies().then(console.log);
setTimeout(function () {
    provider.getMovies().then(console.log);
}, 1500);


