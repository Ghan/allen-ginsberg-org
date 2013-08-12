'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('gApp.services', []).
	factory('bioMichaelService', ['$http', function($http) {
    return{
      name: 'Bio Michael Service',
      getBio: function(token, callback){
        $http.get('http://localhost:8080/locomotive/api/pages/5202e463228ae5000200000d.json?auth_token='+token).success(function(data) {
          // prepare data here
          callback(data.raw_template);
        });
      }
    }
	}]).
	factory('timelineService', ['$http', function($http) {
    return{
      name: 'Timeline Service',
      getBio: function(token, callback){
        $http.get('http://localhost:8080/locomotive/api/content_types/life_events/entries.json?auth_token='+token).success(function(data) {
          // prepare data here
          console.log(data);
          callback(data);
        });
      }
    }
	}]);
