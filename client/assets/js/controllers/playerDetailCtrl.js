'use strict';

angular.module('application').controller('playerDetailCtrl', function ($q, $stateParams, $scope, fumbblData, utils) {
  var playerId = $stateParams.playerId;
  var teamId = $stateParams.teamId;

  fumbblData.getTeamDataById(teamId)
    .then(setTeamData)
    .then(setRosterData)

  function setRosterData(roster) {
    var position = roster.position.filter(function (position) {
      return position['@id'] === $scope.player.positionId;
    });

    if (position.length) {
      $scope.position = position[0];
    }

    var attributes = {
      movement: $scope.position.movement,
      strength: $scope.position.strength,
      agility: $scope.position.agility,
      armorValue: $scope.position.armour,
    };

    $scope.attributes = attributes;

    console.dir($scope.position);
  }

  function setTeamData (teamData) {
    var players = teamData.player.filter(function (playerData) {
      return playerData['@id'] === playerId;
    });

    $scope.player = players[0];
    $scope.stats = $scope.player.playerStatistics;

    console.dir($scope.player);

    return fumbblData.getRosterById(teamData.rosterId);
  }

});