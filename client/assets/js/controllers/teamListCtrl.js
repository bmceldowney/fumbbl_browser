'use strict';

angular.module('application').controller('teamListCtrl', function ($scope, $state, $stateParams, fumbblData) {
  if (!$stateParams.coachName) {
    $state.go('home');
    return;
  }

  fumbblData.getTeamsByCoachName($stateParams.coachName).then(
    function success (result) {
      $scope.coachName = $stateParams.coachName;
      $scope.teams = result.teams.team;

      console.dir(result);
    },
    function error () {
      $scope.coachName = '';
      $scope.teams = [];
      $state.go('home');
    });


  function orderTeamsByDivision (teams) {
    var divisions = {};

    teams.forEach(function (team) {
      var divisionStr = fumbblData.getDivisionById(team.division);
      if (!divisions[divisionStr]) {
        divisions[divisionStr] = [];
        divisions[divisionStr].push(team);
      }
    });

    return divisions;
  }
});
