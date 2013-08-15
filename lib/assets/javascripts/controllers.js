'use strict';

/* Controllers */
angular.module('gApp.controllers', []).
  controller('indexCtrl', [function() {

  }])
  .controller('biographyCtrl', ['$scope', 'bioMichaelService', 'timelineService', 'timelinePhotoService', function($scope, bioMichaelService, timelineService, timelinePhotoService) { 
  	bioMichaelService.getBio(api_token, function(data){
  		$scope.bioByMichael = data;
  	});
    // interactive timeline 
    $scope.timeline = [{title:"Move Slider to View", date:"1926-01-01"}];
    $scope.currentTime = 0;
    timelineService.getData(api_token, function(data){
      $scope.timeline = data;
      // console.log(data);
    });
    $scope.$watch("", function() { 
      // watches "currentTime"
      if(!$scope.timeline[$scope.currentTime].imageSent){
        console.log($scope.currentTime);
        $scope.timeline[$scope.currentTime].imageSent = true;
        timelinePhotoService.getData(api_token, $scope.currentTime, $scope.timeline[$scope.currentTime].id, function(data){
          console.log(data[1]);
          $scope.timeline[data[0]].image = '<img src="http://allen-ginsberg-org.herokuapp.com'+ data[1] +'" />';
        });
      }
    }, true);
    // date format
    $scope.dateDisplay = function(value) {
      return formatDate($scope.timeline[value].date);
    }
  }])
  .controller('worksCtrl', [function() {

  }])
  .controller('archiveCtrl', [function() {

  }])
  .controller('linksCtrl', [function() {

  }]);