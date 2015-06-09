'use strict';

angular.module('application').controller('teamDetailCtrl', function ($stateParams, $scope, fumbblData) {
  fumbblData.getTeamDataById($stateParams.id).then(
  function success (result) {
    $scope.team = result;
    fumbblData.getRosterById(result.rosterId).then(
      function (rosterInfo) {
        $scope.roster = rosterInfo;
      });
  },
  function error () {

  });

});
