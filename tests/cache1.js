var BaseProvider = require('../BaseProvider');
var LocalCache = require('../LocalCache');
var Utils = require('../utils');

var MyProvider = function () {
    BaseProvider.call(this, { cache: new LocalCache("test.cache") });
};

Utils.Klass.extend(MyProvider, BaseProvider);

MyProvider.prototype = Utils.extend(MyProvider.prototype, {

    NoCache: true,
    getMovies: function () {
        console.log("[getMovies]");
        return ["The avengers", "Star Wars", "Sleepless in seattle"];
    },
    
    TVShows: {
        getShows: function () {
            console.log("[TVShows.getShows]");
            return [
                "It's always sunny in Philadelphia",
                "Friends",
                "Mr. Robot"
           ];
        }
    }

});


//////////////// RUN

var provider = new MyProvider();

provider.getMovies().then(console.log);
provider.getMovies().then(console.log);
provider.TVShows.getShows().then(console.log);
provider.TVShows.getShows().then(console.log);

