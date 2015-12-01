/* global ; */
/**
 * LocalStorage
 *
 * Currently using synchronous accesses to avoid any edge cases
 * @TODO: improve
 *  - Should we store the content of the cache in memory ? worth it ?
 *  - Best way to handle errors in file operations ?
 *  - Best way to use async file operations without any edge cases ?
 */
var fs = require('fs');
var _openedFiles = {};
var _isRunning = true;

var save = function () {
  if (!_isRunning) {
      return;
  }
  _isRunning = false;
  for (var file in _openedFiles) {
      var data = _openedFiles[file];
      try {
          var str = JSON.stringify(data);
          fs.writeFileSync(file, str);
      } catch (e) {
          // Do nothing
      }
  } 
};

var createFile = function (filename) {
    var fd = fs.openSync(filename, 'w');
    fs.closeSync(fd);
};

// We only save when the process ends
process.on('exit', save);
process.on('SIGINT', save);
process.on('uncaughtException', save);

var LocalStorage = function(path) {
	if (!path) {
		throw "[LocalStorage] File name required";
	}
    try {
        if (!fs.existsSync(path)) {
            createFile(path);
        }
        
        this._path = fs.realpathSync(path);
        if (_openedFiles[this._path]) {
            // The file is already opened
            return;
        }
        
        var content = fs.readFileSync(this._path);
        _openedFiles[this._path] = content.toString() ? JSON.parse(content.toString()) : {};
        
        fs.watch(this._path, { persistent: false, recursive: false }, function onFileChanged (changedFile) {
            if (!_isRunning) {
                return;
            }
            try {
                // We update our in-memory content of the file to reflect the changes
                var content = fs.readFileSync(changedFile);
                _openedFiles[changedFile] = content ? JSON.parse(content) : {};
            } catch (e) {
                
            }
        }.bind(null, this._path));
        
    } catch (e) {
        // @TODO: Review, which behavior is best ?
    }
};

LocalStorage.prototype = {

    _data: null,

    set: function(key, value) {
        var data = _openedFiles[this._path];
        if (data) {
            data[key] = value;
        }
    },

    unset: function(key) {
        this.set(key, null);
    },

    get: function(key) {
        var data = _openedFiles[this._path];
        if (!data) {
            return null;
        }
        return data[key];
    },

    clear: function() {
        _openedFiles[this._path] = {};
    }

};

module.exports = LocalStorage;