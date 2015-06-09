(function() {
  'use strict';

  var module = angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider', '$httpProvider'];

  function config($urlProvider, $locationProvider, $httpProvider) {
    $urlProvider.otherwise('/');

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $locationProvider.html5Mode({
      enabled: false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    Parse.initialize('gQXnvWk0slPHaL810whmLIT7lgfqIhx0to1tLpxc', 'j87Wj8nqIS6HVcIMV9ezhAiYWOVIp4Cet5H4cuxr');
    FastClick.attach(document.body);
  }

})();
