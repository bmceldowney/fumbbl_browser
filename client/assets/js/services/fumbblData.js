'use strict';
(function () {
  angular.module('application').service('fumbblData', function ($q, Cache) {
    var teamDataCache = new Cache(5 * 60 * 1000);

    function getTeamDataById (teamId) {
      var team = teamDataCache.get(teamId);
      if (team) {
        return $q.when(team);
      }
      var promise = $q.when(Parse.Cloud.run('team', { id: teamId }))
        .then(
          function success(result) {
            var data = xmlToObject(result);
            team = data.team;

            teamDataCache.add(teamId, team);
            return team;
          });

      return promise;
    }

    function getRosterById (rosterId) {
      var promise = $q.when(Parse.Cloud.run('roster', { id: rosterId }))
        .then(function (result) {
          return xmlToObject(result).roster;
        });

      return promise;
    }

    function getTeamsByCoachName (coachName) {
      var promise = $q.when(Parse.Cloud.run('coach', { coachName: coachName }))
        .then(
          function success(result) {
            return xmlToObject(result);
          });

      return promise;
    }

    function getDivisionById (divisionId) {
      var divisions = [
        '',
        'Ranked',
        '',
        '',
        '',
        'League',
        '',
        '',
        '',
        '',
        'Blackbox'
      ];

      return divisions[divisionId];
    }

    return {
      getTeamsByCoachName: getTeamsByCoachName,
      getTeamDataById: getTeamDataById,
      getRosterById: getRosterById,
      getDivisionById: getDivisionById
    };
  });


/* PRIVATE STATIC */

  function xmlToObject(xml) {
    var dom = null;

    if (window.DOMParser) {
      try {
         dom = (new DOMParser()).parseFromString(xml, 'text/xml');
      }
      catch (e) { dom = null; }
    }
    else if (window.ActiveXObject) {
      try {
        dom = new window.ActiveXObject('Microsoft.XMLDOM');
        dom.async = false;
        if (!dom.loadXML(xml)) {
          console.log(dom.parseError.reason + dom.parseError.srcText);
        } // parse error
      }

      catch (e) { dom = null; }
    }

    var json = xml2json(dom, '  ');
    var obj = JSON.parse(json);

    return obj;
  }
})();
