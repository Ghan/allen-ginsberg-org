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
          callback(data.raw_template);
        });
      }
    }
	}]).
	factory('timelineService', ['$http', function($http) {
    return{
      name: 'Timeline Service',
      getData: function(token, callback){
        $http.get('http://localhost:8080/locomotive/api/content_types/life_events/entries.json?timeline=true&auth_token='+token).success(function(data) {
          // prepare data here
          data.sort(predicatBy("date"));
          callback(data);
        });
      }
    }
	}]).
  factory('timelinePhotoService', ['$http', function($http) {
    return{
      name: 'Timeline Photo Service',
      getData: function(token, currentTime, id, callback){
        $http.get('http://localhost:8080/locomotive/api/content_types/life_events/entries/'+id+'.json?auth_token='+token).success(function(res) {
          // prepare data here
          var formattedDate = res.formatted_date;
          var geo = res.geo[0];
          var notable = res.notable[0];
          console.log(geo + " " + notable + " " + formattedDate);
          $http.get('http://localhost:8080/locomotive/api/content_types/archive_items/entries.json?timeline_photo=true&auth_token='+token+'&tldate='+formattedDate+'&tlgeo='+geo+'&tlnotable='+notable).success(function(data) {
            var urlToUse = data.file_slash_image;
            var sendBack = [currentTime, urlToUse];
            callback(sendBack);
          });
        });
      }
    }
  }]);
