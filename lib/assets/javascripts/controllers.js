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
      $scope.finishedLoadingAnnouncements = true;
      $scope.blog = data[0];
    });
    $scope.swapPage = function(pageToken, direction){
      $scope.finishedLoadingAnnouncements = false;
      blogService.getItems(token, pageToken, direction, function(data){
        $scope.finishedLoadingAnnouncements = true;
        $scope.blog = data[0];
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
      });
  }])  
  .controller('contactCtrl', ['$scope', 'contactService', function($scope, contactService) { 
    activeMenu("contact-link");
    contactService.getBio(api_token, function(data){
      $scope.page = data;
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
      });
    }
    $scope.$watch("", function() { 
      // watches "currentTime"... gets a similar image. currently disabled.
      if(!$scope.timeline[$scope.currentTime].imageSent){
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
      $scope.work[$scope.workSlug] = data;
      $scope.notable = $scope.work[$scope.workSlug].notable;
      $scope.geo = $scope.work[$scope.workSlug].geo;
      $scope.date = $scope.work[$scope.workSlug].date;
      $scope.itemsInArchive = $scope.work[$scope.workSlug].archive_items.toString().replace(/,/g,"|");
      // $scope.misc = $scope.work[$scope.workId].misc_tag;
      if($scope.work[$scope.workSlug].archive_items.length){
        itemsInArchiveService.getData(api_token, $scope.itemsInArchive, function(data){
          $scope.formattedItemsInArchive = data;
        });
      }
      $scope.finishedLoadingSimilarWorks = false;
      // similarWorksService.getData(api_token, $scope.geo, $scope.notable, $scope.date, function(data){
      //   for (var i = data.length - 1; i >= 0; i--) {
      //     if(data[i].id == $scope.work[$scope.workSlug].id){
      //       data.splice(i, 1);
      //     }
      //   };
      //   $scope.similarWorks = data;
      //   $scope.finishedLoadingSimilarWorks = true;
      // });
    });
  }])
  .controller('archiveCtrl', ['$scope', '$sce', 'Archive', '$routeParams', 'archiveIndexService', function($scope, $sce, Archive, $routeParams, archiveIndexService) {
    activeMenu("archive-link");
    $scope.archType = $routeParams.type || "photography";
    $scope.archive = Archive;
    $scope.viewAllClicked = false;
    $scope.finishedLoadingArchive = false;
    // fetch data
    $scope.$watch("archType", function() {
      if(!$scope.archive[$scope.archType]){
        archiveIndexService.getData(api_token, $scope.archType, function(data){
          if($scope.archType == "lecture"){
            var newData = [];
            for(var key in data){
              var index = 999;
              var intOfKey = parseInt(key.substring(0,1));
              var newKey;
              if(!!intOfKey){
                // is sorted, pull number and make it the sort value
                index = intOfKey - 1;
                newKey = key.substring(2, key.length);
              } else {
                newKey = key;
              }
              newData.push({
                "series" : newKey,
                "index" : index,
                "data" : data[key]
              });
            }
            newData.sort(function(a,b){return a.index - b.index;});
            data = newData;
          } else {
            for (var i = data.length - 1; i >= 0; i--) {
              data[i].image = $sce.trustAsHtml(data[i].image);
            }
          };
          $scope.archive[$scope.archType] = data;
          $scope.finishedLoadingArchive = true;
        });
      }
    });
  }])
  .controller('archiveDetailCtrl', ['$scope', 'Archive', '$routeParams', 'archiveDetailService', 'similarArchiveItemsService', 'publishedInService', 'atThisTimeService', 'otherClassService', 'nextPageService', '$location', function($scope, Archive, $routeParams, archiveDetailService, similarArchiveItemsService, publishedInService, atThisTimeService, otherClassService, nextPageService, $location) {
    activeMenu("archive-link");
    $scope.archType = $routeParams.type;
    $scope.slug = $routeParams.slug;
    $scope.archive = Archive;
    $scope.$watch("slug", function(){
      if(!$scope.archive[$scope.slug]){
        archiveDetailService.getData(api_token, $routeParams.slug, function(data){
          $scope.archive[$scope.slug] = data;
          $scope.item = data;
          window.onload = function(){
            var contentScrollDiv = parseInt($("#left-side").outerHeight(true))-32;
            // $("#content-scroll").css("height", );
            if ($("right-side").scrollTop() == $('#right-side').height("'"+contentScrollDiv+"'")){
               $("#scroll-for-more").hide();
            }
          };
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
              for (var i = data.length - 1; i >= 0; i--) {
                if(data[i].slug === $scope.slug){
                  data.splice(i,1);
                }
              };
              $scope.otherClass = data;
              $scope.finishedLoadingOtherClass = true;
            });
          }
          $scope.finishedLoadingAtThisTime = false;
          if($scope.archType != "lecture"){
            atThisTimeService.getData(api_token, $scope.item.date, function(data){
              $scope.atThisTime = data;
              $scope.finishedLoadingAtThisTime = true;
            });
          }
          $scope.finishedLoadingSimilarContent = false;
          similarArchiveItemsService.getData(api_token, $scope.item.slug, $scope.item.geo, $scope.item.notable, $scope.item.misc, $scope.item.date, function(archiveData){
            $scope.similarArchiveItems = archiveData;
            $scope.finishedLoadingSimilarContent = true;
          });
          // Toolbox
          $scope.expanded = false;
          $scope.expandText = "Expand";
          $scope.expand = function(){
            if(!$scope.expanded){
              $("#left-side").css("width", "100%");
              $("#right-side").css("width", "96%");
              $scope.expanded = true;
              $scope.expandText = "Smaller"
            } else {
              $("#left-side").css("width", "58%");
              $("#right-side").css("width", "35%");
              $scope.expanded = false;
              $scope.expandText = "Expand";
            }
          }
          $scope.nextImageText = "Next Image >>";
          $scope.nextImageClicked = false;
          $scope.nextImage = function(){
            $scope.nextImageClicked = true;
            $scope.nextImageText = "Fetching next image...";
            nextPageService.getData(api_token, $scope.item.id, $scope.archType, function(data){
              $location.search("id",null);
              $location.path('/archive/'+$scope.archType+'/'+data.slug).search('id', data.id);
            });
          }
        });
      }
    });
  }])
  .controller('linksCtrl', ['$scope', 'linksService', 'Links', function($scope, linksService, Links) {
    activeMenu("links-link");
    $scope.linksData = Links;
    $scope.finishedLoadingLinks = false;
    if (!$scope.linksData[1]){
      linksService.getData(api_token, function(data){
        $scope.finishedLoadingLinks = true;
        $scope.linksData = data;
      });
    }
    $scope.$watch('linksData', function(){
      Links = $scope.linksData;
    });
  }])
  .controller('adminCtrl', ['$scope', 'resetCacheService', function($scope, resetCacheService) {
    $scope.password = "405e13";
    $scope.inputPW = "";
    $scope.status = "";
    $scope.editpage = "";
    $scope.targetURL;
    $scope.getEditPage = function(editpage){
      $scope.targetURL = "";
      var parts = editpage.substring(7).split(/[\/\?]/);
      var contentType = "archive_items";
      var id = parts[parts.length-1].substring(3);
      for (var i = parts.length - 1; i >= 0; i--) {
        if(parts[i] === "works") contentType = "published_work";
      };
      $scope.targetURL = "http://allen-ginsberg-org.herokuapp.com/locomotive/content_types/"+contentType+"/entries/"+id+"/edit";

    }
    $scope.reset = function(){
      resetCacheService.getData(api_token, function(data){
        $scope.status = data;
      });
    }
  }]);