'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('gApp.services', []).
  factory('Timeline', [function() {
    var Timeline = {};
    return Timeline;
  }]).
  factory('Works', [function() {
    var Works = {};
    return Works;
  }]).
  factory('Archive', [function() {
    var Archive = {};
    return Archive;
  }]).
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
  }]).
  factory('worksIndexService', ['$http', function($http) {
    return{
      name: 'Works Index Service',
      getData: function(token, type, callback){
        $http.get('http://localhost:8080/locomotive/api/content_types/published_work/entries.json?works_index=true&work_type='+type+'&auth_token='+token).success(function(data) {
          // prepare data here
          for (var i=0;i<data.length;i++){ 
            // newData[data[i].id] = data[i];
            data[i].image = '<img src="http://allen-ginsberg-org.herokuapp.com'+data[i].imageThumb+'" />';
          }
          callback(data);
        });
      }
    }
  }]).
  factory('worksDetailService', ['$http', function($http) {
    return{
      name: 'Works Detail Service',
      getData: function(token, id, callback){
        $http.get('http://localhost:8080/locomotive/api/content_types/published_work/entries/'+id+'.json?&auth_token='+token).success(function(data) {
          // prepare data here
          var reformattedData = {
            "name":data.content.name,
            "id": data.content.id,
            "publisher": data.content.publisher,
            "date": data.content.date,
            "amazon_slash_itunes_url" : data.content.amazon_slash_itunes_url,
            "description" : data.content.description,
            "geo" : data.content.geo,
            "notable" : data.content.notable,
            "archive_items": data.content.archive_items,
            "misc_tag": data.content.misc_tag,
            "type" : data.content.type,
            "image" : "<img src='http://allen-ginsberg-org.herokuapp.com"+data.image+"' />"
          }
          callback(reformattedData);
        });
      }
    }
  }]).
  factory('archiveIndexService', ['$http', function($http) {
    return{
      name: 'Archive Index Service',
      getData: function(token, callback){
        $http.get('http://localhost:8080/locomotive/api/content_types/archive_items/entries.json?archive_index=true&auth_token='+token).success(function(data) {
          // prepare data here
          var fixedData = { 
              "photography":[],
              "art":[],
              "lecture":[],
              "document":[]
          };
          var types = ["photography","art","lecture","document"];
          for (var i = data.length - 1; i >= 0; i--) {
            data[i].title = data[i].title.replace(/"/g,'&quot;');
            data[i].image = '<img src="http://allen-ginsberg-org.herokuapp.com'+data[i].file_slash_image+'" title="'+data[i].title+'" alt="'+data[i].title+'" data-date="'+data[i].date+'"/>';
            for (var j = types.length - 1; j >= 0; j--) {
              if(data[i].archive_type == types[j]){
                fixedData[types[j]].push(data[i]);
              }
            };
          };
          callback(fixedData);
        });
      }
    }
  }]);
