'use strict';

angular.module('application').controller('mainCtrl', function ($scope, $state, fumbblData, utils) {
  console.log('entering mainCtrl');

  $scope.$watch('coach', utils.debounce(function (value) {
    if (!value) { return; }

    $state.go('home.teamList', { coachName: value });
  }, 750));
});
