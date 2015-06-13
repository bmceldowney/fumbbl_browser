'use strict';

angular.module('application').controller('playerDetailCtrl', function ($q, $stateParams, $scope, fumbblData, utils) {
  var playerId = $stateParams.playerId;
  var teamId = $stateParams.teamId;
  var positionSkills = [];
  var playerSkills = [];
  var injuries = [];
  var attributeMap = {
    'MA': 'movement',
    'ST': 'strength',
    'AG': 'agility',
    'AV': 'armorValue'
  }

  $scope.attributeClasses = {
    MA: '',
    ST: '',
    AG: '',
    AV: ''
  }

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

    $scope.position.skillList && (positionSkills = Array.isArray($scope.position.skillList.skill) ? $scope.position.skillList.skill : [$scope.position.skillList.skill]);
    $scope.player.skillList && (playerSkills = Array.isArray($scope.player.skillList.skill) ? $scope.player.skillList.skill : [$scope.player.skillList.skill]);

    var attributes = {
      movement: $scope.position.movement,
      strength: $scope.position.strength,
      agility: $scope.position.agility,
      armorValue: $scope.position.armour,
    };

    $scope.attributes = attributes;

    $scope.player.injuryList && (injuries = Array.isArray($scope.player.injuryList.injury) ? $scope.player.injuryList.injury : [$scope.player.injuryList.injury]);
    injuries = injuries.map(mapInjuries);

    $scope.injuries = injuries;

    var skills = positionSkills
                  .concat(playerSkills)
                  .filter(filterStatBoosts);

    $scope.skills = skills;

    console.dir($scope.position);



    /* Helpers */

    function mapInjuries (injury) {
      var injuryText = injury;

      if (injury['#text']) {
        injuryText = injury['#text'];
      }

      var statBreak = injuryText.match(/\(-([A-Z]{2})\)/g);

      if (statBreak && statBreak[0]) {
        applyStatBreak(statBreak[0]);
      }

      return injuryText;
    }

    function filterStatBoosts (boost) {
      var isStatBoost = boost.indexOf('+') === 0;

      if (isStatBoost) {
        applyStatBoost(boost);
      }

      return !isStatBoost;
    }

    function applyStatBoost (statBoost) {
      boostName = statBoost.substr(1);
      var attributeName = attributeMap[boostName];
      $scope.attributes[attributeName]++;
      $scope.attributeClasses[boostName] = 'boosted';
    }

    function applyStatBreak (statBreak) {
      breakName = statBreak.substr(2, 2);
      var attributeName = attributeMap[breakName];
      $scope.attributes[attributeName]--;
      $scope.attributeClasses[breakName] = 'broke';
    }
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