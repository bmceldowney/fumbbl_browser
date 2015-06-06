'use strict';
(function () {

  angular.module('application').directive('teamRow', function (fumbblData) {
    return {
      scope: { team: '=' },
      link: function (scope, element) {
        fumbblData.getTeamDataById(scope.team.id).then(
          function success (result) {
            var record = result.record;
            scope.record = record.wins + ' | ' + record.ties + ' | ' + record.losses;
          },
          function error () {

          });
      },
      templateUrl: 'templates/teamRow.html'
    };
  });
})();
