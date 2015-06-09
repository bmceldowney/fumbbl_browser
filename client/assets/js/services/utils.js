angular.module('application').service('utils', function () {
  var service = {};

  service.debounce = function (func, wait) {
    var timeout;
    return function() {
      var context = this;
      var args = arguments;
      var callback = function() {
        func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(callback, wait);
    };
  }

  return service;
});