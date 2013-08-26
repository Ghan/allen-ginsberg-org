'use strict';

/* Controllers */
angular.module('gApp.controllers', []).
  controller('indexCtrl', [function() {

  }])
  .controller('blogCtrl', ['$scope', 'Blog', '$routeParams', 'blogService', function($scope, Blog, $routeParams, blogService) {
    // $scope.page = $routeParams.page || "1";
    var token = 'AIzaSyCYaNs_olVIPwfHTl3UOhiD92KeThBoTVk';
    $scope.blog = Blog;
    blogService.getItems(token, "", function(data){
      console.log(data);
      $scope.blog = data;
    });
    $scope.swapPage = function(pageToken){
      blogService.getItems(token, pageToken, function(data){
        $scope.blog = data;
        console.log($scope.blog);
        $anchorScroll();
      });
    }
  }])
  .controller('blogPostCtrl', ['$scope', 'Blog', '$routeParams', 'blogPostService', function($scope, Blog, $routeParams, blogPostService) {
    var token = 'AIzaSyCYaNs_olVIPwfHTl3UOhiD92KeThBoTVk';
    blogPostService.getPost(token, $routeParams.id, function(data){
        $scope.post = data;
        console.log(data);
      });
  }])  
  .controller('biographyCtrl', ['$scope', 'Timeline', 'bioMichaelService', 'timelineService', 'timelinePhotoService', function($scope, Timeline, bioMichaelService, timelineService, timelinePhotoService) { 
    bioMichaelService.getBio(api_token, function(data){
      $scope.bioByMichael = data;
    });
    // interactive timeline 
    $scope.timeline = Timeline;
    $scope.currentTime = 0;
    if(!$scope.timeline[1]){
      timelineService.getData(api_token, function(data){
        $scope.timeline = data;
        // console.log(data);
      });
    }
    $scope.$watch("", function() { 
      // watches "currentTime"... gets a similar image. currently disabled.
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
  .controller('worksCtrl', ['$scope', 'Works', '$routeParams', 'worksIndexService', function($scope, Works, $routeParams, worksIndexService) {
    $scope.workType = $routeParams.type || "book";
    $scope.work = Works;
    // fetch data
    $scope.$watch("workType", function() {
      if(!$scope.work[$scope.workType]){
        worksIndexService.getData(api_token, $scope.workType, function(data){
          $scope.work[$scope.workType] = data;
        }); 
      }
    });
  }])
  .controller('worksDetailCtrl', ['$scope', 'Works', '$routeParams', 'worksDetailService', function($scope, Works, $routeParams, worksDetailService) {
    $scope.workType = $routeParams.type;
    $scope.workSlug = $routeParams.slug;
    $scope.workId = $routeParams.id;
    $scope.work = Works;
    worksDetailService.getData(api_token, $scope.workId, function(data){
      console.log(data);
      $scope.work[$scope.workId] = data;
      // $scope.notable = $scope.work[$scope.workId].notable;
      // $scope.geo = $scope.work[$scope.workId].geo;
      // $scope.misc = $scope.work[$scope.workId].misc_tag;
      // console.log($scope.notable);
    });
  }])
  .controller('archiveCtrl', ['$scope', 'Archive', '$routeParams', 'archiveIndexService', function($scope, Archive, $routeParams, archiveIndexService) {
    $scope.archive = Archive;
    if(!$scope.archive.photography){
      archiveIndexService.getData(api_token, function(data){
        $scope.archive = data;
        console.log($scope.archive.photography);
      });
    }
    $scope.$watch("archive", function() {
      Archive = $scope.archive;
    });
  }])
  .controller('archiveDetailCtrl', ['$scope', 'Archive', '$routeParams', 'archiveDetailService', function($scope, Archive, $routeParams, archiveDetailService) {
    archiveDetailService.getData(api_token, $routeParams.id, function(data){
      $scope.item = data;
    });
  }])
  .controller('linksCtrl', ['$scope', 'linksService', function($scope, linksService) {
    linksService.getData(api_token, function(data){
      $scope.links = data;
    });
  }]);