'use strict';

angular.module('application').controller('homeCtrl', function ($scope, $state, fumbblData, utils) {
  console.log('entering homeCtrl');

  $scope.$watch('coach', utils.debounce(function (value) {
    if (!value) { return; }

    $state.go('home.coachDetail', { coachName: value });
  }, 750));
});
