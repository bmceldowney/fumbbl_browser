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

  function debounce(func, wait) {
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

  module.controller('mainCtrl', function ($scope, $state, fumbblData) {
    console.log('entering mainCtrl');

    $scope.$watch('coach', debounce(function (value) {
      if (!value) { return; }

      $state.go('home.teamList', { coachName: value });
    }, 750));
  });

  module.controller('teamListCtrl', function ($scope, $state, $stateParams, fumbblData) {
    if (!$stateParams.coachName) {
      $state.go('home');
      return;
    }

    fumbblData.getTeamsByCoachName($stateParams.coachName).then(
      function success (result) {
        $scope.teams = result.teams.team;
      },
      function error () {
        $scope.teams = [];
        $state.go('home');
      });

  });

  module.controller('teamDetailCtrl', function ($stateParams, $scope, fumbblData) {
    fumbblData.getTeamDataById($stateParams.id).then(
    function success (result) {
      $scope.team = result;
      fumbblData.getRosterById(result.rosterId).then(
        function (rosterInfo) {
          $scope.roster = rosterInfo;
          console.dir(rosterInfo);
        });
    },
    function error () {

    });

  });

})();
