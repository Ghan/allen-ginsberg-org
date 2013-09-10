'use strict';

/* Controllers */
angular.module('gApp.controllers', []).
  controller('indexCtrl', ['$scope', '$sce', 'homepageService', function($scope, $sce, homepageService) {
    activeMenu("home-link");
    homepageService.getData(api_token, function(data){
      $scope.homepageText = $sce.trustAsHtml(data);
    });
  }])
  .controller('blogCtrl', ['$scope', 'Blog', '$routeParams', 'blogService', function($scope, Blog, $routeParams, blogService) {
    // $scope.page = $routeParams.page || "1";
    activeMenu("announcements-link");
    var token = 'AIzaSyCYaNs_olVIPwfHTl3UOhiD92KeThBoTVk';
    $scope.blog = Blog;
    $scope.finishedLoadingAnnouncements = false;
    blogService.getItems(token, "", "", function(data){
      // console.log(data);
      $scope.finishedLoadingAnnouncements = true;
      $scope.blog = data[0];
    });
    $scope.swapPage = function(pageToken, direction){
      $scope.finishedLoadingAnnouncements = false;
      blogService.getItems(token, pageToken, direction, function(data){
        $scope.finishedLoadingAnnouncements = true;
        $scope.blog = data[0];
        // console.log($scope.blog);
        $('body').scrollTop(0);
        if(data[1] == 'prev'){
          $scope.blog.prevPageToken = "";
        }
      });
    }
  }])
  .controller('blogPostCtrl', ['$scope', 'Blog', '$routeParams', 'blogPostService', function($scope, Blog, $routeParams, blogPostService) {
    activeMenu("announcements-link");
    var token = 'AIzaSyCYaNs_olVIPwfHTl3UOhiD92KeThBoTVk';
    blogPostService.getPost(token, $routeParams.id, function(data){
        $scope.post = data;
        // console.log(data);
      });
  }])  
  .controller('biographyCtrl', ['$scope', 'Timeline', 'bioMichaelService', 'timelineService', 'timelinePhotoService', function($scope, Timeline, bioMichaelService, timelineService, timelinePhotoService) { 
    activeMenu("biography-link");
    bioMichaelService.getBio(api_token, function(data){
      $scope.bioByMichael = data;
    });
    // interactive timeline 
    $scope.timeline = Timeline;
    $scope.finishedLoadingTimeline = false;
    $scope.currentTime = 0;
    if(!$scope.timeline[1]){
      timelineService.getData(api_token, function(data){
        $scope.timeline = data;
        $scope.finishedLoadingTimeline = true;
        // console.log(data);
      });
    }
    $scope.$watch("", function() { 
      // watches "currentTime"... gets a similar image. currently disabled.
      if(!$scope.timeline[$scope.currentTime].imageSent){
        // console.log($scope.currentTime);
        $scope.timeline[$scope.currentTime].imageSent = true;
        // timelinePhotoService.getData(api_token, $scope.currentTime, $scope.timeline[$scope.currentTime].id, function(data){
        //   // console.log(data[1]);
        //   $scope.timeline[data[0]].image = '<img src="http://allen-ginsberg-org.herokuapp.com'+ data[1] +'" />';
        // });
      }
    }, true);
    // date format
    $scope.dateDisplay = function(value) {
      return formatDate($scope.timeline[value].date);
    }
  }])
  .controller('worksCtrl', ['$scope', 'Works', '$routeParams', 'worksIndexService', function($scope, Works, $routeParams, worksIndexService) {
    activeMenu("works-link");
    $scope.workType = $routeParams.type || "book";
    $scope.work = Works;
    $scope.finishedLoadingWorks = false;
    // fetch data
    $scope.$watch("workType", function() {
      if(!$scope.work[$scope.workType]){
        worksIndexService.getData(api_token, $scope.workType, function(data){
          $scope.work[$scope.workType] = data;
          $scope.finishedLoadingWorks = true;
        }); 
      }
    });
  }])
  .controller('worksDetailCtrl', ['$scope', 'Works', '$routeParams', 'worksDetailService', 'similarWorksService', 'itemsInArchiveService', function($scope, Works, $routeParams, worksDetailService, similarWorksService, itemsInArchiveService) {
    activeMenu("works-link");
    $scope.workType = $routeParams.type;
    $scope.workSlug = $routeParams.slug;
    // $scope.workId = $routeParams.id;
    $scope.work = Works;
    worksDetailService.getData(api_token, $scope.workSlug, function(data){
      $scope.work[$scope.workId] = data;
      $scope.notable = $scope.work[$scope.workId].notable;
      $scope.geo = $scope.work[$scope.workId].geo;
      $scope.date = $scope.work[$scope.workId].date;
      $scope.itemsInArchive = $scope.work[$scope.workId].archive_items.toString().replace(/,/g,"|");
      // $scope.misc = $scope.work[$scope.workId].misc_tag;
      if($scope.work[$scope.workId].archive_items.length){
        itemsInArchiveService.getData(api_token, $scope.itemsInArchive, function(data){
          $scope.formattedItemsInArchive = data;
        });
      }
      $scope.finishedLoadingSimilarWorks = false;
      similarWorksService.getData(api_token, $scope.geo, $scope.notable, $scope.date, function(data){
        for (var i = data.length - 1; i >= 0; i--) {
          if(data[i].id == $scope.work[$scope.workId].id){
            data.splice(i, 1);
          }
          var imageURL = "";
          if(data[i].imageThumb.indexOf("blank.png") != -1){
            imageURL = "http://allen-ginsberg-org.herokuapp.com"+data[i].imageThumb;
          } else {
            imageURL = "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url="+data[i].imageThumb+"&container=focus&resize_w=100&refresh=2592000";
          }
          data[i].link = "<a href='#/works/"+data[i].type+"/"+data[i].slug+"' title='"+data[i].name+"'><img src='"+imageURL+"' alt='"+data[i].name+"' /></a>";
        };
        $scope.similarWorks = data;
        $scope.finishedLoadingSimilarWorks = true;
      });
    });
  }])
  .controller('archiveCtrl', ['$scope', 'Archive', '$routeParams', 'archiveIndexService', function($scope, Archive, $routeParams, archiveIndexService) {
    activeMenu("archive-link");
    $scope.archive = Archive;
    $scope.page = 5;
    $scope.finishedLoadingArchive = false;
    if(!$scope.archive.photography){
      archiveIndexService.getData(api_token, function(data){
        $scope.archive = data;
        $scope.finishedLoadingArchive = true;
        // console.log($scope.archive.photography);
      });
    }
    $scope.$watch("archive", function() {
      Archive = $scope.archive;
    });
  }])
  .controller('archiveDetailCtrl', ['$scope', 'Archive', '$routeParams', 'archiveDetailService', 'similarArchiveItemsService', 'publishedInService', 'atThisTimeService', 'otherClassService', function($scope, Archive, $routeParams, archiveDetailService, similarArchiveItemsService, publishedInService, atThisTimeService, otherClassService) {
    activeMenu("archive-link");
    archiveDetailService.getData(api_token, $routeParams.slug, function(data){
      $scope.item = data;
      $scope.publishedInString = $scope.item.published_in.toString().replace(/,/g,"|");
      $scope.finishedLoadingPublishedIn = false;
      if($scope.item.published_in.length){
        publishedInService.getData(api_token, $scope.publishedInString, function(data){
          $scope.formattedPublishedIn = data;
          $scope.finishedLoadingPublishedIn = true;
        });
      }
      $scope.otherClass = [];
      $scope.finishedLoadingOtherClass = false;
      if($scope.item.class_id){
        otherClassService.getData(api_token, $scope.item.class_id, function(data){
          $scope.otherClass = data;
          $scope.finishedLoadingOtherClass = true;
          console.log(data);
        });
      }
      $scope.finishedLoadingAtThisTime = false;
      atThisTimeService.getData(api_token, $scope.item.date, function(data){
        $scope.atThisTime = data;
        $scope.finishedLoadingAtThisTime = true;
      });
      $scope.finishedLoadingSimilarContent = false;
      similarArchiveItemsService.getData(api_token, $scope.item.slug, $scope.item.geo, $scope.item.notable, $scope.item.misc, $scope.item.date, function(archiveData){
        $scope.similarArchiveItems = archiveData;
        $scope.finishedLoadingSimilarContent = true;
      });
    });
  }])
  .controller('linksCtrl', ['$scope', 'linksService', 'Links', function($scope, linksService, Links) {
    activeMenu("links-link");
    console.log(Links);
    $scope.linksData = Links;
    $scope.finishedLoadingLinks = false;
    if (!$scope.linksData[1]){
      linksService.getData(api_token, function(data){
        $scope.finishedLoadingLinks = true;
        $scope.linksData = data;
        console.log(Links);
      });
    }
    $scope.$watch('linksData', function(){
      Links = $scope.linksData;
    });
  }]);