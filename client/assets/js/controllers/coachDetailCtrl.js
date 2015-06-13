'use strict';

angular.module('application').controller('coachDetailCtrl', function ($scope, $state, $stateParams, fumbblData) {
  if (!$stateParams.coachName) {
    $state.go('home');
    return;
  }

  fumbblData.getTeamsByCoachName($stateParams.coachName).then(
    function success (result) {
      $scope.coachName = $stateParams.coachName;
      $scope.divisions = orderTeamsByDivision(result.teams.team);

      console.dir(result);
    },
    function error () {
      $scope.coachName = '';
      $scope.teams = [];
      $state.go('home');
    });

  function orderTeamsByDivision (teams) {
    var divisions = [];

    teams.forEach(function (team) {
      var divisionStr = fumbblData.getDivisionById(team.division);
      getTeamRecordDataAsync(team.id).then(function (recordData) {
        team.record = recordData;
      });

      if (!divisions[team.division]) {
        divisions[team.division] = {};
        divisions[team.division].name = divisionStr;
        divisions[team.division].teams = [];
      }

      divisions[team.division].teams.push(team);
    });

    return divisions;
  }

  function getTeamRecordDataAsync (teamId) {
    return fumbblData.getTeamDataById(teamId).then(
      function success (result) {
        var record = result.record;
        return record.wins + ' | ' + record.ties + ' | ' + record.losses;
      });
  }
});
