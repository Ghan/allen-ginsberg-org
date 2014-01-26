'use strict';

/* Controllers */
angular.module('gApp.controllers', []).
  controller('indexCtrl', ['$scope', '$sce', 'homepageService', 'Analytics', function($scope, $sce, homepageService, Analytics) {
    Analytics.trackPage('/');
    activeMenu("home-link");
    homepageService.getData(api_token, function(data){
      $scope.homepageText = $sce.trustAsHtml(data);
    });
  }])
  .controller('blogCtrl', ['$scope', 'Blog', '$routeParams', 'blogService', 'Analytics', function($scope, Blog, $routeParams, blogService, Analytics) {
    // $scope.page = $routeParams.page || "1";
    Analytics.trackPage('/blog');
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
  .controller('contactCtrl', ['$scope', 'contactService', 'Analytics', function($scope, contactService, Analytics) { 
    Analytics.trackPage('/contact');
    activeMenu("contact-link");
    contactService.getBio(api_token, function(data){
      $scope.page = data;
    });
  }])
  .controller('biographyCtrl', ['$scope', 'Timeline', 'bioMichaelService', 'timelineService', 'timelinePhotoService', 'Analytics', function($scope, Timeline, bioMichaelService, timelineService, timelinePhotoService, Analytics) { 
    Analytics.trackPage('/biography');
    activeMenu("biography-link");
    bioMichaelService.getBio(api_token, function(data){
      $scope.bioByMichael = data;
    });
    // interactive timeline 
    $scope.timeline = Timeline;
    $scope.finishedLoadingTimeline = false;
    $scope.currentItem = 0;
    $scope.selected;

    $scope.selectDecade= function(item) {
       $scope.selected = item; 
    };

    $scope.decadeClass = function(item) {
        return item === $scope.selected ? 'active' : undefined;
    };

    $scope.updateItem = function(item) {
      $scope.currentItem = item;
    }

    if(!$scope.timeline[1]){
      timelineService.getData(api_token, function(data){
        $scope.timeline = data;
        console.log(data);
        $scope.finishedLoadingTimeline = true;
      });
    }
    // date format
    $scope.dateDisplay = function(value) {
      return formatDate($scope.timeline[value].date);
    }
  }])
  .controller('worksCtrl', ['$scope', 'Works', '$routeParams', 'worksIndexService', 'Analytics', function($scope, Works, $routeParams, worksIndexService, Analytics) {
    Analytics.trackPage('/works');
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
  .controller('worksDetailCtrl', ['$scope', 'Works', '$routeParams', 'worksDetailService', 'similarWorksService', 'itemsInArchiveService', 'Analytics', function($scope, Works, $routeParams, worksDetailService, similarWorksService, itemsInArchiveService, Analytics) {
    Analytics.trackPage('/works/'+$routeParams.type+"/"+$routeParams.slug);
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
  .controller('archiveCtrl', ['$scope', '$sce', 'Archive', '$routeParams', 'archiveIndexService', 'Analytics', function($scope, $sce, Archive, $routeParams, archiveIndexService, Analytics) {
    Analytics.trackPage('/archive');
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
  .controller('archiveDetailCtrl', ['$scope', 'Archive', '$routeParams', 'archiveDetailService', 'similarArchiveItemsService', 'publishedInService', 'atThisTimeService', 'otherClassService', 'nextPageService', '$location', 'Analytics', function($scope, Archive, $routeParams, archiveDetailService, similarArchiveItemsService, publishedInService, atThisTimeService, otherClassService, nextPageService, $location, Analytics) {
    Analytics.trackPage('/archive/'+$routeParams.type+"/"+$routeParams.slug);
    activeMenu("archive-link");
    $scope.archType = $routeParams.type;
    $scope.slug = $routeParams.slug;
    $scope.archive = Archive;
    $scope.next_link = "";
    $scope.prev_link = "";
    $scope.otherClass = [];
    $scope.finishedLoadingPublishedIn = false;
    $scope.finishedLoadingOtherClass = false;
    $scope.finishedLoadingAtThisTime = false;

    $scope.$watch("slug", function(){
      // get page data
      if(!$scope.archive[$scope.slug]){
        archiveDetailService.getData(api_token, $routeParams.slug, function(data){
          $scope.item = data;
          $scope.archive[$scope.slug] = $scope.item;
          
          //next page
          nextPageService.getData(api_token, $scope.item.id, $scope.archType, function(data){
            $scope.next_link = 'archive/'+$scope.archType+'/'+data.next_slug+'?id='+data.next_id;
            $scope.prev_link = 'archive/'+$scope.archType+'/'+data.prev_slug+'?id='+data.prev_id;
            $scope.archive[$scope.slug].next_link = $scope.next_link;
            $scope.archive[$scope.slug].prev_link = $scope.prev_link;
          });
          //published in
          var publishedInString = $scope.item.published_in.toString().replace(/,/g,"|");
          publishedInService.getData(api_token, publishedInString, function(data){
            $scope.finishedLoadingPublishedIn = true;
            $scope.formattedPublishedIn = data;
            console.log(data);
            $scope.archive[$scope.slug].formattedPublishedIn = $scope.formattedPublishedIn;
          });
          // other classes
          if($scope.item.class_id){
            otherClassService.getData(api_token, $scope.item.class_id, function(data){
              $scope.finishedLoadingOtherClass = true;
              for (var i = data.length - 1; i >= 0; i--) {
                if(data[i].slug === $scope.slug){
                  data.splice(i,1);
                }
              };
              $scope.otherClass = data;
              $scope.archive[$scope.slug].otherClass = data;
            });
          }
          //Also at this time
          if($scope.archType != "lecture"){
            atThisTimeService.getData(api_token, $scope.item.date, function(data){
              $scope.finishedLoadingAtThisTime = true;
              $scope.atThisTime = data;
              $scope.archive[$scope.slug].atThisTime = data;
            });
          }
        });
      } else {
        $scope.item = $scope.archive[$scope.slug];

        $scope.next_link = $scope.archive[$scope.slug].next_link;
        $scope.prev_link = $scope.archive[$scope.slug].prev_link;
        
        if ($scope.archive[$scope.slug].formattedPublishedIn){
          $scope.finishedLoadingPublishedIn = true;
          $scope.formattedPublishedIn = $scope.archive[$scope.slug].formattedPublishedIn;
        }
        if($scope.archive[$scope.slug].otherClass){
          $scope.finishedLoadingOtherClass = true;
          $scope.otherClass = $scope.archive[$scope.slug].otherClass;
        }
        if($scope.archive[$scope.slug].atThisTime){
          $scope.finishedLoadingAtThisTime = true;
          $scope.atThisTime = $scope.archive[$scope.slug].atThisTime;
        }
      }

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
    });
  }])
  .controller('linksCtrl', ['$scope', 'linksService', 'Links', 'Analytics', function($scope, linksService, Links, Analytics) {
    Analytics.trackPage('/links');
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