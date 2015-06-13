'use strict';

angular.module('application').factory('Cache', function (localStorageService) {
  var Cache = function (lifespan) {
    this.lifespan = lifespan;
  };

  function add (key, value) {
    var item = {
          value: value,
          timestamp: Date.now()
        }

    localStorageService.set(key, item);
  }

  function get (key) {
    var item = localStorageService.get(key);

    if (!item) { return null; }
    if (Date.now() - item.timestamp > this.lifespan) { return null; }

    return item.value;
  }

  Cache.prototype = {
    add: add,
    get: get
  };

  return Cache;
});
