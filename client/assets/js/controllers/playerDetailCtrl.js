'use strict';

angular.module('application').controller('playerDetailCtrl', function ($stateParams, $scope, fumbblData) {
  var playerId = $stateParams.playerId;
  var teamId = $stateParams.teamId;

  fumbblData.getTeamDataById(teamId).then(function (teamData) {
    var players = teamData.player.filter(function (playerData) {
      return playerData['@id'] === playerId;
    });

    $scope.player = players[0];
    $scope.stats = $scope.player.playerStatistics;
    console.dir($scope.player);
  });
});