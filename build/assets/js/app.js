(function() {
  'use strict';

  var module = angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider', '$httpProvider'];

  function config($urlProvider, $locationProvider, $httpProvider) {
    $urlProvider.otherwise('/');

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $locationProvider.html5Mode({
      enabled: false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    Parse.initialize('gQXnvWk0slPHaL810whmLIT7lgfqIhx0to1tLpxc', 'j87Wj8nqIS6HVcIMV9ezhAiYWOVIp4Cet5H4cuxr');
    FastClick.attach(document.body);
  }

  function debounce(func, wait) {
    var timeout;
    return function() {
      var context = this;
      var args = arguments;
      var callback = function() {
        func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(callback, wait);
    };
  }

  module.controller('mainCtrl', function ($scope, $state, fumbblData) {
    console.log('entering mainCtrl');

    $scope.$watch('coach', debounce(function (value) {
      if (!value) { return; }

      $state.go('home.teamList', { coachName: value });
    }, 750));
  });

  module.controller('teamListCtrl', function ($scope, $state, $stateParams, fumbblData) {
    if (!$stateParams.coachName) {
      $state.go('home');
      return;
    }

    fumbblData.getTeamsByCoachName($stateParams.coachName).then(
      function success (result) {
        $scope.teams = result.teams.team;
      },
      function error () {
        $scope.teams = [];
        $state.go('home');
      });

  });

  module.controller('teamDetailCtrl', function ($stateParams, $scope, fumbblData) {
    fumbblData.getTeamDataById($stateParams.id).then(
    function success (result) {
      $scope.team = result;
      fumbblData.getRosterById(result.rosterId).then(
        function (rosterInfo) {
          $scope.roster = rosterInfo;
          console.dir(rosterInfo);
        });
    },
    function error () {

    });

  });

})();

/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
   Version: 0.9
	Author:  Stefan Goessner/2006
	Web:     http://goessner.net/ 
*/
function xml2json(xml, tab) {
   var X = {
      toObj: function(xml) {
         var o = {};
         if (xml.nodeType==1) {   // element node ..
            if (xml.attributes.length)   // element with attributes  ..
               for (var i=0; i<xml.attributes.length; i++)
                  o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
            if (xml.firstChild) { // element has child nodes ..
               var textChild=0, cdataChild=0, hasElementChild=false;
               for (var n=xml.firstChild; n; n=n.nextSibling) {
                  if (n.nodeType==1) hasElementChild = true;
                  else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                  else if (n.nodeType==4) cdataChild++; // cdata section node
               }
               if (hasElementChild) {
                  if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                     X.removeWhite(xml);
                     for (var n=xml.firstChild; n; n=n.nextSibling) {
                        if (n.nodeType == 3)  // text node
                           o["#text"] = X.escape(n.nodeValue);
                        else if (n.nodeType == 4)  // cdata node
                           o["#cdata"] = X.escape(n.nodeValue);
                        else if (o[n.nodeName]) {  // multiple occurence of element ..
                           if (o[n.nodeName] instanceof Array)
                              o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                           else
                              o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                        }
                        else  // first occurence of element..
                           o[n.nodeName] = X.toObj(n);
                     }
                  }
                  else { // mixed content
                     if (!xml.attributes.length)
                        o = X.escape(X.innerXml(xml));
                     else
                        o["#text"] = X.escape(X.innerXml(xml));
                  }
               }
               else if (textChild) { // pure text
                  if (!xml.attributes.length)
                     o = X.escape(X.innerXml(xml));
                  else
                     o["#text"] = X.escape(X.innerXml(xml));
               }
               else if (cdataChild) { // cdata
                  if (cdataChild > 1)
                     o = X.escape(X.innerXml(xml));
                  else
                     for (var n=xml.firstChild; n; n=n.nextSibling)
                        o["#cdata"] = X.escape(n.nodeValue);
               }
            }
            if (!xml.attributes.length && !xml.firstChild) o = null;
         }
         else if (xml.nodeType==9) { // document.node
            o = X.toObj(xml.documentElement);
         }
         else
            alert("unhandled node type: " + xml.nodeType);
         return o;
      },
      toJson: function(o, name, ind) {
         var json = name ? ("\""+name+"\"") : "";
         if (o instanceof Array) {
            for (var i=0,n=o.length; i<n; i++)
               o[i] = X.toJson(o[i], "", ind+"\t");
            json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
         }
         else if (o == null)
            json += (name&&":") + "null";
         else if (typeof(o) == "object") {
            var arr = [];
            for (var m in o)
               arr[arr.length] = X.toJson(o[m], m, ind+"\t");
            json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
         }
         else if (typeof(o) == "string")
            json += (name&&":") + "\"" + o.toString() + "\"";
         else
            json += (name&&":") + o.toString();
         return json;
      },
      innerXml: function(node) {
         var s = ""
         if ("innerHTML" in node)
            s = node.innerHTML;
         else {
            var asXml = function(n) {
               var s = "";
               if (n.nodeType == 1) {
                  s += "<" + n.nodeName;
                  for (var i=0; i<n.attributes.length;i++)
                     s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
                  if (n.firstChild) {
                     s += ">";
                     for (var c=n.firstChild; c; c=c.nextSibling)
                        s += asXml(c);
                     s += "</"+n.nodeName+">";
                  }
                  else
                     s += "/>";
               }
               else if (n.nodeType == 3)
                  s += n.nodeValue;
               else if (n.nodeType == 4)
                  s += "<![CDATA[" + n.nodeValue + "]]>";
               return s;
            };
            for (var c=node.firstChild; c; c=c.nextSibling)
               s += asXml(c);
         }
         return s;
      },
      escape: function(txt) {
         return txt.replace(/[\\]/g, "\\\\")
                   .replace(/[\"]/g, '\\"')
                   .replace(/[\n]/g, '\\n')
                   .replace(/[\r]/g, '\\r');
      },
      removeWhite: function(e) {
         e.normalize();
         for (var n = e.firstChild; n; ) {
            if (n.nodeType == 3) {  // text node
               if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                  var nxt = n.nextSibling;
                  e.removeChild(n);
                  n = nxt;
               }
               else
                  n = n.nextSibling;
            }
            else if (n.nodeType == 1) {  // element node
               X.removeWhite(n);
               n = n.nextSibling;
            }
            else                      // any other node
               n = n.nextSibling;
         }
         return e;
      }
   };
   if (xml.nodeType == 9) // document node
      xml = xml.documentElement;
   var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
   return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
}

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

'use strict';

angular.module('application').factory('Cache', function () {
  var Cache = function (lifespan) {
    this.store = {};
    this.lifespan = lifespan;
  };

  function add (key, value) {
    this.store[key] = {};
    this.store[key].data = value;
    this.store[key].timestamp = Date.now();
  }

  function get (key) {
    var item = this.store[key];
    if (!item) { return null; }
    if (Date.now() - item.timestamp > this.lifespan) { return null; }

    return item.data;
  }

  Cache.prototype = {
    add: add,
    get: get
  };

  return Cache;
});

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

    return {
      getTeamsByCoachName: getTeamsByCoachName,
      getTeamDataById: getTeamDataById,
      getRosterById: getRosterById
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
